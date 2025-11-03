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
    const resumeId = params.id;

    console.log(`[ViewAPI] POST /api/resumes/${resumeId}/view 호출됨`);

    // 이력서 존재 확인
    const resume = await prisma.resumes.findUnique({
      where: { id: resumeId },
      select: { id: true, viewCount: true },
    });

    if (!resume) {
      console.error(`[ViewAPI] 이력서를 찾을 수 없음: ${resumeId}`);
      return NextResponse.json(
        createErrorResponse("이력서를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    console.log(`[ViewAPI] 이력서 발견 - 현재 조회수: ${resume.viewCount}`);

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
      `[Resume ${resumeId}] View increment API called by user: ${
        userId || "anonymous"
      }, identifier: ${userIdentifier}`
    );

    // 조회수 직접 증가
    let updateResult;
    try {
      console.log(
        `[ViewAPI] 조회수 증가 시작 - 사용자: ${userId || "anonymous"}`
      );

      // resumes 테이블의 viewCount 필드 증가
      updateResult = await prisma.resumes.update({
        where: { id: resumeId },
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
    console.error("Resume view increment error:", error);
    return NextResponse.json(
      createErrorResponse("조회수 증가 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}