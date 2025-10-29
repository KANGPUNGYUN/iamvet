import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { createNotification } from "@/lib/database";
import { sql } from "@/lib/db";
import { createApiResponse, createErrorResponse } from "@/lib/utils";

// DELETE /api/admin/forums/[id]/comments/[commentId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const authResult = verifyAdminToken(request);
  if (!authResult.success) {
    return NextResponse.json(
      createErrorResponse(authResult.error || "권한이 없습니다"),
      { status: 401 }
    );
  }

  try {
    const { id, commentId } = await params;

    // 댓글 정보 조회 (작성자 정보 포함)
    const commentResult = await sql`
      SELECT fc.id, fc.forum_id, fc.user_id, fc.parent_id, fc.content, fc."createdAt", fc."updatedAt", fc."deletedAt",
             COALESCE(v."realName", vs."realName", h."hospitalName", v.nickname, vs.nickname, '사용자') as "authorName", 
             u.email as "authorEmail"
      FROM forum_comments fc
      JOIN users u ON fc.user_id = u.id
      LEFT JOIN veterinarians v ON u.id = v."userId" AND u."userType" = 'VETERINARIAN'
      LEFT JOIN veterinary_students vs ON u.id = vs."userId" AND u."userType" = 'VETERINARY_STUDENT'
      LEFT JOIN hospitals h ON u.id = h."userId" AND u."userType" = 'HOSPITAL'
      WHERE fc.id = ${commentId} AND fc.forum_id = ${id} AND fc."deletedAt" IS NULL
    `;

    if (commentResult.length === 0) {
      return NextResponse.json(
        createErrorResponse("댓글을 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    const comment = commentResult[0];

    // 포럼 정보 조회
    const forumResult = await sql`
      SELECT title FROM forum_posts WHERE id = ${id}
    `;
    const forum = forumResult[0];

    // 답글이 있는지 확인
    const replies = await sql`
      SELECT id, user_id, content FROM forum_comments 
      WHERE parent_id = ${commentId} AND "deletedAt" IS NULL
    `;

    // 댓글과 답글 삭제 (Neon은 간단한 트랜잭션 지원)
    try {
      // 1. 댓글 소프트 삭제
      await sql`
        UPDATE forum_comments 
        SET "deletedAt" = CURRENT_TIMESTAMP 
        WHERE id = ${commentId}
      `;

      // 2. 답글도 함께 삭제
      if (replies.length > 0) {
        await sql`
          UPDATE forum_comments 
          SET "deletedAt" = CURRENT_TIMESTAMP 
          WHERE parent_id = ${commentId}
        `;
      }
    } catch (deleteError) {
      console.error("댓글 삭제 실패:", deleteError);
      throw deleteError;
    }

    // 3. 작성자에게 알림 보내기
    const notificationTitle = "댓글이 삭제되었습니다";
    const notificationContent = `관리자가 "${forum?.title || '포럼'}" 게시글의 댓글을 삭제했습니다.\n삭제된 댓글: "${comment.content.substring(0, 50)}${comment.content.length > 50 ? '...' : ''}"`;
    
    console.log('Sending notification to user:', {
      userId: comment.user_id,
      type: 'SYSTEM',
      title: notificationTitle,
      adminId: authResult.success ? authResult.payload.userId : undefined
    });
    
    await createNotification({
      userId: comment.user_id,
      type: 'SYSTEM',
      title: notificationTitle,
      content: notificationContent,
      senderId: authResult.success ? authResult.payload.userId : undefined
    });

    // 4. 답글 작성자들에게도 알림 보내기
    let replyNotificationCount = 0;
    if (replies.length > 0) {
      const uniqueReplyAuthors = new Set();

      for (const reply of replies) {
        // 댓글 작성자와 다른 사용자이고, 중복되지 않은 경우에만 알림 발송
        if (reply.user_id !== comment.user_id && !uniqueReplyAuthors.has(reply.user_id)) {
          uniqueReplyAuthors.add(reply.user_id);
          
          try {
            await createNotification({
              userId: reply.user_id,
              type: 'SYSTEM',
              title: "답글이 삭제되었습니다",
              content: `관리자가 "${forum?.title || '포럼'}" 게시글의 댓글과 함께 답글을 삭제했습니다.\n삭제된 답글: "${reply.content.substring(0, 50)}${reply.content.length > 50 ? '...' : ''}"`,
              senderId: authResult.success ? authResult.payload.userId : undefined
            });
            replyNotificationCount++;
          } catch (notificationError) {
            console.error("답글 알림 발송 실패:", notificationError);
            // 알림 실패해도 계속 진행
          }
        }
      }
    }

    return NextResponse.json(
      createApiResponse("success", "댓글이 삭제되었습니다", {
        deletedCount: 1 + replies.length,
        notificationsSent: 1 + replyNotificationCount
      })
    );

  } catch (error) {
    console.error("관리자 댓글 삭제 오류:", error);
    return NextResponse.json(
      createErrorResponse("댓글 삭제 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}