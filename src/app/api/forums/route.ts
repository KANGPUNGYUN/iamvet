import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { getForumsWithPagination, createForum } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getForumsWithPagination(page, limit);

    return NextResponse.json(
      createApiResponse("success", "임상포럼 목록 조회 성공", {
        forums: result,
        totalCount: result.length,
      })
    );
  } catch (error) {
    console.error("Forums list error:", error);
    return NextResponse.json(
      createErrorResponse("임상포럼 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const forumData = await request.json();

    // 임상포럼 게시글 생성
    const forum = await createForum({
      ...forumData,
      userId: user.userId,
    });

    return NextResponse.json(
      createApiResponse("success", "임상포럼 게시글이 등록되었습니다", forum)
    );
  } catch (error) {
    console.error("Forum create error:", error);
    return NextResponse.json(
      createErrorResponse("임상포럼 게시글 등록 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});
