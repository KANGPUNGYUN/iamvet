import { NextRequest, NextResponse } from "next/server";
import {
  createApiResponse,
  createErrorResponse,
  generateUserIdentifier,
} from "@/lib/utils";
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
    const lectureId = params.id;

    console.log(`[ViewAPI] POST /api/lectures/${lectureId}/view 호출됨`);

    // 강의 존재 확인
    const lecture = await prisma.lectures.findUnique({
      where: { id: lectureId },
      select: { id: true, viewCount: true },
    });

    if (!lecture) {
      console.error(`[ViewAPI] 강의를 찾을 수 없음: ${lectureId}`);
      return NextResponse.json(
        createErrorResponse("강의를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    console.log(`[ViewAPI] 강의 발견 - 현재 조회수: ${lecture.viewCount}`);

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
      `[Lecture ${lectureId}] View increment API called by user: ${
        userId || "anonymous"
      }, identifier: ${userIdentifier}`
    );

    // 조회수 직접 증가
    let updateResult;
    try {
      console.log(
        `[ViewAPI] 조회수 증가 시작 - 사용자: ${userId || "anonymous"}`
      );

      // lectures 테이블의 viewCount 필드 증가
      updateResult = await prisma.lectures.update({
        where: { id: lectureId },
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

      // 성공 응답 반환
      return NextResponse.json(
        createApiResponse("success", "조회수가 증가되었습니다.", {
          viewCount: updateResult.viewCount,
        })
      );
    } catch (error) {
      console.error(`[ViewAPI] 조회수 증가 실패 - 상세 오류:`, error);
      return NextResponse.json(
        createErrorResponse("조회수 증가 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Lecture view increment error:", error);
    return NextResponse.json(
      createErrorResponse("조회수 증가 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}