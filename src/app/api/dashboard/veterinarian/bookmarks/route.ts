import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/api";
import { getUserBookmarks } from "@/lib/database";

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    if (user.userType !== "veterinarian") {
      return NextResponse.json(
        createErrorResponse("수의사만 접근할 수 있습니다"),
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // "jobs" | "lectures" | "transfers" | "all"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const bookmarks = await getUserBookmarks(user.userId, {
      type,
      page,
      limit,
    });

    return NextResponse.json(
      createApiResponse("success", "북마크 목록 조회 성공", bookmarks)
    );
  } catch (error) {
    console.error("Veterinarian bookmarks error:", error);
    return NextResponse.json(
      createErrorResponse("북마크 목록 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});