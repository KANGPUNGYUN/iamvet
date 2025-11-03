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
    const transferId = params.id;

    console.log(`[ViewAPI] POST /api/transfers/${transferId}/view 호출됨`);

    // 양도양수 존재 확인
    const transfer = await prisma.transfers.findUnique({
      where: { id: transferId },
      select: { id: true, views: true },
    });

    if (!transfer) {
      console.error(`[ViewAPI] 양도양수를 찾을 수 없음: ${transferId}`);
      return NextResponse.json(
        createErrorResponse("양도양수 게시글을 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    console.log(`[ViewAPI] 양도양수 발견 - 현재 조회수: ${transfer.views}`);

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
      `[Transfer ${transferId}] View increment API called by user: ${
        userId || "anonymous"
      }, identifier: ${userIdentifier}`
    );

    // 조회수 직접 증가
    let updateResult;
    try {
      console.log(
        `[ViewAPI] 조회수 증가 시작 - 사용자: ${userId || "anonymous"}`
      );

      // transfers 테이블의 views 필드 증가
      updateResult = await prisma.transfers.update({
        where: { id: transferId },
        data: {
          views: {
            increment: 1,
          },
        },
        select: {
          id: true,
          views: true,
        },
      });

      console.log(
        `[ViewAPI] 조회수 업데이트 완료 - 새 조회수: ${updateResult.views}`
      );

      // 성공 응답 반환
      return NextResponse.json(
        createApiResponse("success", "조회수가 증가되었습니다.", {
          viewCount: updateResult.views,
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
    console.error("Transfer view increment error:", error);
    return NextResponse.json(
      createErrorResponse("조회수 증가 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}