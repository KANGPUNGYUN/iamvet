import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { getForumBookmarks } from "@/lib/database";

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // 사용자의 포럼 북마크 목록 조회
    const bookmarks = await getForumBookmarks(user.userId);
    
    return NextResponse.json(
      createApiResponse("success", "포럼 북마크 목록을 성공적으로 조회했습니다", bookmarks)
    );
  } catch (error) {
    console.error("Forum bookmarks fetch error:", error);
    return NextResponse.json(
      createErrorResponse("포럼 북마크 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});