import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { getTransfersWithPagination, createTransfer } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getTransfersWithPagination(page, limit);

    return NextResponse.json(
      createApiResponse("success", "양도양수 목록 조회 성공", {
        transfers: result,
        totalCount: result.length,
      })
    );
  } catch (error) {
    console.error("Transfers list error:", error);
    return NextResponse.json(
      createErrorResponse("양도양수 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const transferData = await request.json();

    // 양도양수 게시글 생성
    const transfer = await createTransfer({
      ...transferData,
      userId: user.userId,
    });

    return NextResponse.json(
      createApiResponse("success", "양도양수 게시글이 등록되었습니다", transfer)
    );
  } catch (error) {
    console.error("Transfer create error:", error);
    return NextResponse.json(
      createErrorResponse("양도양수 게시글 등록 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});
