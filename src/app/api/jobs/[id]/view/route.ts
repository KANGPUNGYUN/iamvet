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
    const jobId = params.id;

    console.log(`[ViewAPI] POST /api/jobs/${jobId}/view 호출됨`);

    // 채용공고 존재 확인
    const job = await prisma.jobs.findUnique({
      where: { id: jobId },
      select: { id: true, viewCount: true },
    });

    if (!job) {
      console.error(`[ViewAPI] 채용공고를 찾을 수 없음: ${jobId}`);
      return NextResponse.json(
        createErrorResponse("채용공고를 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    console.log(`[ViewAPI] 채용공고 발견 - 현재 조회수: ${job.viewCount}`);

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
      `[Job ${jobId}] View increment API called by user: ${
        userId || "anonymous"
      }, identifier: ${userIdentifier}`
    );

    // 조회수 직접 증가
    let updateResult;
    try {
      console.log(
        `[ViewAPI] 조회수 증가 시작 - 사용자: ${userId || "anonymous"}`
      );

      // jobs 테이블의 viewCount 필드 증가
      updateResult = await prisma.jobs.update({
        where: { id: jobId },
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
    console.error("Job view increment error:", error);
    return NextResponse.json(
      createErrorResponse("조회수 증가 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}