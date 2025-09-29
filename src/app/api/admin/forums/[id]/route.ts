import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { sql } from '@/lib/db';

// 포럼 상세 조회 (관리자용)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    // const adminAuth = verifyAdminToken(request);
    // if (!adminAuth.success) {
    //   return NextResponse.json(
    //     { status: 'error', message: '관리자 인증이 필요합니다.' },
    //     { status: 401 }
    //   );
    // }

    const { id } = await params;
    
    if (!id || id === 'null' || id === 'undefined') {
      return NextResponse.json(
        { status: 'error', message: '유효하지 않은 포럼 ID입니다.' },
        { status: 400 }
      );
    }

    // 포럼 상세 조회
    const forumResult = await sql`
      SELECT 
        fp.id,
        fp.title,
        fp.content,
        fp."animalType",
        fp."medicalField",
        fp."viewCount",
        fp."createdAt",
        fp."updatedAt",
        fp."deletedAt",
        fp."userId",
        CASE 
          WHEN u."userType" = 'VETERINARIAN' THEN COALESCE(v.nickname, v."realName")
          WHEN u."userType" = 'VETERINARY_STUDENT' THEN COALESCE(vs.nickname, vs."realName")
          WHEN u."userType" = 'HOSPITAL' THEN h."hospitalName"
          ELSE u.email
        END as author_name,
        u."userType" as author_type,
        u.email as author_email,
        u.phone as author_phone,
        COUNT(DISTINCT fc.id) as comment_count,
        COUNT(DISTINCT fpl.id) as like_count
      FROM forum_posts fp
      LEFT JOIN users u ON fp."userId" = u.id
      LEFT JOIN veterinarians v ON u.id = v."userId" AND u."userType" = 'VETERINARIAN'
      LEFT JOIN veterinary_students vs ON u.id = vs."userId" AND u."userType" = 'VETERINARY_STUDENT'
      LEFT JOIN hospitals h ON u.id = h."userId" AND u."userType" = 'HOSPITAL'
      LEFT JOIN forum_comments fc ON fp.id = fc.forum_id AND fc."deletedAt" IS NULL
      LEFT JOIN forum_post_likes fpl ON fp.id = fpl."forumPostId"
      WHERE fp.id = ${id}
      GROUP BY fp.id, u.id, u.email, u.phone, u."userType", v.nickname, v."realName", vs.nickname, vs."realName", h."hospitalName"
    `;

    if (forumResult.length === 0) {
      return NextResponse.json(
        { status: 'error', message: '포럼 게시물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const forum = forumResult[0];

    // 최근 댓글 조회 (최대 10개)
    const recentCommentsResult = await sql`
      SELECT 
        fc.id,
        fc.content,
        fc."createdAt",
        CASE 
          WHEN u."userType" = 'VETERINARIAN' THEN COALESCE(v.nickname, v."realName")
          WHEN u."userType" = 'VETERINARY_STUDENT' THEN COALESCE(vs.nickname, vs."realName")
          WHEN u."userType" = 'HOSPITAL' THEN h."hospitalName"
          ELSE u.email
        END as commenter_name,
        u."userType" as commenter_type
      FROM forum_comments fc
      LEFT JOIN users u ON fc.user_id = u.id
      LEFT JOIN veterinarians v ON u.id = v."userId" AND u."userType" = 'VETERINARIAN'
      LEFT JOIN veterinary_students vs ON u.id = vs."userId" AND u."userType" = 'VETERINARY_STUDENT'
      LEFT JOIN hospitals h ON u.id = h."userId" AND u."userType" = 'HOSPITAL'
      WHERE fc.forum_id = ${id} AND fc."deletedAt" IS NULL
      ORDER BY fc."createdAt" DESC
      LIMIT 10
    `;

    // 작성자의 다른 게시물 조회
    const authorOtherPostsResult = await sql`
      SELECT 
        id,
        title,
        "createdAt",
        "deletedAt"
      FROM forum_posts fp
      WHERE fp."userId" = ${forum.userId}
        AND fp.id != ${id}
      ORDER BY fp."createdAt" DESC
      LIMIT 5
    `;

    // 데이터 변환
    const forumData = {
      id: parseInt(forum.id),
      title: forum.title,
      content: forum.content || '',
      author: {
        id: parseInt(forum.userId),
        name: forum.author_name || forum.author_email,
        type: forum.author_type === 'HOSPITAL' ? 'HOSPITAL' : 'VETERINARIAN',
        email: forum.author_email,
        phone: forum.author_phone,
      },
      category: forum.medicalField || 'GENERAL',
      isActive: forum.deletedAt === null,
      viewCount: parseInt(forum.viewCount) || 0,
      likeCount: parseInt(forum.like_count) || 0,
      commentCount: parseInt(forum.comment_count) || 0,
      createdAt: forum.createdAt?.toISOString().split('T')[0],
      updatedAt: forum.updatedAt?.toISOString().split('T')[0],
      tags: [forum.animalType, forum.medicalField].filter(Boolean),
      recentComments: recentCommentsResult.map(comment => ({
        id: comment.id,
        content: comment.content?.substring(0, 100) + (comment.content?.length > 100 ? '...' : ''),
        createdAt: comment.createdAt?.toISOString().split('T')[0],
        author: {
          name: comment.commenter_name,
          type: comment.commenter_type === 'HOSPITAL' ? 'HOSPITAL' : 'VETERINARIAN',
        }
      })),
      authorOtherPosts: authorOtherPostsResult.map(post => ({
        id: post.id,
        title: post.title,
        createdAt: post.createdAt?.toISOString().split('T')[0],
        isActive: post.deletedAt === null,
      })),
    };

    return NextResponse.json({
      status: 'success',
      data: forumData,
    });

  } catch (error) {
    console.error('포럼 상세 조회 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 포럼 상태 변경 (관리자용)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    // const adminAuth = verifyAdminToken(request);
    // if (!adminAuth.success) {
    //   return NextResponse.json(
    //     { status: 'error', message: '관리자 인증이 필요합니다.' },
    //     { status: 401 }
    //   );
    // }

    const { id } = await params;
    
    if (!id || id === 'null' || id === 'undefined') {
      return NextResponse.json(
        { status: 'error', message: '유효하지 않은 포럼 ID입니다.' },
        { status: 400 }
      );
    }
    const { action, reason } = await request.json();

    // 유효한 액션인지 확인
    const validActions = ['activate', 'deactivate'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { status: 'error', message: '유효하지 않은 액션입니다.' },
        { status: 400 }
      );
    }

    // 포럼 게시물 존재 확인
    const existingForum = await sql`
      SELECT id, "deletedAt", "userId"
      FROM forum_posts
      WHERE id = ${id}
    `;

    if (existingForum.length === 0) {
      return NextResponse.json(
        { status: 'error', message: '포럼 게시물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 상태 업데이트
    if (action === 'activate') {
      await sql`
        UPDATE forum_posts
        SET 
          "deletedAt" = NULL,
          "updatedAt" = NOW()
        WHERE id = ${id}
      `;
    } else if (action === 'deactivate') {
      await sql`
        UPDATE forum_posts
        SET 
          "deletedAt" = NOW(),
          "updatedAt" = NOW()
        WHERE id = ${id}
      `;
    }

    // TODO: 상태 변경 로그 기록
    // await sql`
    //   INSERT INTO admin_logs (action, target_type, target_id, admin_id, reason, created_at)
    //   VALUES (${action}, 'forum_post', ${id}, ${adminAuth.adminId}, ${reason || ''}, NOW())
    // `;

    // TODO: 사용자에게 알림 발송 (상태 변경 시)
    // if (action === 'deactivate') {
    //   // 비활성화 알림 발송
    // } else if (action === 'activate') {
    //   // 활성화 알림 발송
    // }

    return NextResponse.json({
      status: 'success',
      message: `게시물이 성공적으로 ${action === 'activate' ? '활성화' : '비활성화'}되었습니다.`,
      data: {
        id,
        action,
        updatedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('포럼 상태 변경 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 포럼 삭제 (관리자용) - 완전 삭제는 위험하므로 비활성화로 대체
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    // const adminAuth = verifyAdminToken(request);
    // if (!adminAuth.success) {
    //   return NextResponse.json(
    //     { status: 'error', message: '관리자 인증이 필요합니다.' },
    //     { status: 401 }
    //   );
    // }

    const { id } = await params;
    
    if (!id || id === 'null' || id === 'undefined') {
      return NextResponse.json(
        { status: 'error', message: '유효하지 않은 포럼 ID입니다.' },
        { status: 400 }
      );
    }
    const { reason } = await request.json();

    // 포럼 게시물 존재 확인
    const existingForum = await sql`
      SELECT id, "userId"
      FROM forum_posts
      WHERE id = ${id}
    `;

    if (existingForum.length === 0) {
      return NextResponse.json(
        { status: 'error', message: '포럼 게시물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 소프트 삭제 (deletedAt 설정)
    await sql`
      UPDATE forum_posts
      SET 
        "deletedAt" = NOW(),
        "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    // 관련 댓글도 소프트 삭제
    await sql`
      UPDATE forum_comments
      SET 
        "deletedAt" = NOW(),
        "updatedAt" = NOW()
      WHERE forum_id = ${id} AND "deletedAt" IS NULL
    `;

    // TODO: 삭제 로그 기록
    // await sql`
    //   INSERT INTO admin_logs (action, target_type, target_id, admin_id, reason, created_at)
    //   VALUES ('delete', 'forum_post', ${id}, ${adminAuth.adminId}, ${reason || ''}, NOW())
    // `;

    // TODO: 사용자에게 삭제 알림 발송

    return NextResponse.json({
      status: 'success',
      message: '게시물이 성공적으로 삭제되었습니다.',
      data: {
        id,
        deletedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('포럼 삭제 실패:', error);
    return NextResponse.json(
      { status: 'error', message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}