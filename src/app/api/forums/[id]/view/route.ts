import { NextRequest, NextResponse } from "next/server";
import {
  createApiResponse,
  createErrorResponse,
  generateUserIdentifier,
} from "@/lib/utils";
import { getForumById } from "@/lib/database";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const forumId = params.id;

    console.log(`[ViewAPI] POST /api/forums/${forumId}/view 호출됨`);

    // 포럼 존재 확인
    const forum = await getForumById(forumId);
    if (!forum) {
      console.error(`[ViewAPI] 포럼을 찾을 수 없음: ${forumId}`);
      return NextResponse.json(
        createErrorResponse("임상포럼 게시글을 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    console.log(`[ViewAPI] 포럼 발견 - 현재 조회수: ${forum.viewCount}`);

    // 사용자 정보 확인 (선택적)
    let userId: string | undefined;
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    const userIdentifier = generateUserIdentifier(request, userId);
    console.log(
      `[Forum ${forumId}] View increment API called by user: ${
        userId || "anonymous"
      }, identifier: ${userIdentifier}`
    );

    // 조회수 직접 증가 (간소화된 방식)
    let updateResult;
    try {
      console.log(
        `[ViewAPI] 조회수 증가 시작 - 사용자: ${userId || "anonymous"}`
      );

      // 간단한 방식으로 조회수 증가 (올바른 모델명 사용)
      updateResult = await prisma.forum_posts.update({
        where: { id: forumId },
        data: {
          viewCount: {
            increment: 1,
          },
        },
        select: {
          id: true,
          viewCount: true,
        },
      });

      console.log(
        `[ViewAPI] 조회수 업데이트 완료 - 새 조회수: ${updateResult.viewCount}`
      );

      // 조회 로그 기록은 일단 제외 (문제 발생 시 원인 파악을 위해)
      // const { createId } = await import("@paralleldrive/cuid2");
      // const logId = createId();
      //
      // await prisma.viewLog.create({
      //   data: {
      //     id: logId,
      //     contentType: "forum",
      //     contentId: forumId,
      //     userId: userId || null,
      //     userIdentifier: userIdentifier,
      //     ipAddress: userIdentifier,
      //   }
      // });

      console.log(`[ViewAPI] 조회수 증가 완료`);
    } catch (error) {
      console.error(`[ViewAPI] 조회수 증가 실패 - 상세 오류:`, error);
    }
  } catch (error) {
    console.error("Forum view increment error:", error);
    return NextResponse.json(
      createErrorResponse("조회수 증가 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
