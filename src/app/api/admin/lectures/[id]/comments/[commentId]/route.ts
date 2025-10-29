import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { createNotification } from "@/lib/database";
import { sql } from "@/lib/db";
import { createApiResponse, createErrorResponse } from "@/lib/utils";

// DELETE /api/admin/lectures/[id]/comments/[commentId]
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
      SELECT lc.*, 
             COALESCE(v."realName", vs."realName", h."hospitalName", v.nickname, vs.nickname, '사용자') as "authorName", 
             u.email as "authorEmail"
      FROM lecture_comments lc
      JOIN users u ON lc."userId" = u.id
      LEFT JOIN veterinarians v ON u.id = v."userId" AND u."userType" = 'VETERINARIAN'
      LEFT JOIN veterinary_students vs ON u.id = vs."userId" AND u."userType" = 'VETERINARY_STUDENT'
      LEFT JOIN hospitals h ON u.id = h."userId" AND u."userType" = 'HOSPITAL'
      WHERE lc.id = ${commentId} AND lc."lectureId" = ${id} AND lc."deletedAt" IS NULL
    `;

    if (commentResult.length === 0) {
      return NextResponse.json(
        createErrorResponse("댓글을 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    const comment = commentResult[0];

    // 강의 정보 조회
    const lectureResult = await sql`
      SELECT title FROM lectures WHERE id = ${id}
    `;
    const lecture = lectureResult[0];

    // 답글이 있는지 확인
    const replies = await sql`
      SELECT id, "userId", content FROM lecture_comments 
      WHERE "parentId" = ${commentId} AND "deletedAt" IS NULL
    `;

    // 댓글과 답글 삭제 (Neon은 간단한 트랜잭션 지원)
    try {
      // 1. 댓글 소프트 삭제
      await sql`
        UPDATE lecture_comments 
        SET "deletedAt" = CURRENT_TIMESTAMP 
        WHERE id = ${commentId}
      `;

      // 2. 답글도 함께 삭제
      if (replies.length > 0) {
        await sql`
          UPDATE lecture_comments 
          SET "deletedAt" = CURRENT_TIMESTAMP 
          WHERE "parentId" = ${commentId}
        `;
      }
    } catch (deleteError) {
      console.error("댓글 삭제 실패:", deleteError);
      throw deleteError;
    }

    // 3. 작성자에게 알림 보내기
    const notificationTitle = "댓글이 삭제되었습니다";
    const notificationContent = `관리자가 "${lecture?.title || '강의'}" 강의의 댓글을 삭제했습니다.\n삭제된 댓글: "${comment.content.substring(0, 50)}${comment.content.length > 50 ? '...' : ''}"`;
    
    console.log('Sending notification to user:', {
      userId: comment.userId,
      type: 'SYSTEM',
      title: notificationTitle,
      adminId: authResult.success ? authResult.payload.userId : undefined
    });
    
    await createNotification({
      userId: comment.userId,
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
        if (reply.userId !== comment.userId && !uniqueReplyAuthors.has(reply.userId)) {
          uniqueReplyAuthors.add(reply.userId);
          
          try {
            await createNotification({
              userId: reply.userId,
              type: 'SYSTEM',
              title: "답글이 삭제되었습니다",
              content: `관리자가 "${lecture?.title || '강의'}" 강의의 댓글과 함께 답글을 삭제했습니다.\n삭제된 답글: "${reply.content.substring(0, 50)}${reply.content.length > 50 ? '...' : ''}"`,
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