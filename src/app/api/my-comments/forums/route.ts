import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { getMyForumComments } from "@/lib/database";

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const userId = user.userId;

    if (!userId) {
      return NextResponse.json(
        createErrorResponse("사용자 ID를 찾을 수 없습니다."),
        { status: 401 }
      );
    }

    const comments = await getMyForumComments(userId);

    return NextResponse.json(
      createApiResponse("success", "내가 작성한 임상포럼 댓글 목록 조회 성공", comments)
    );
  } catch (error) {
    console.error("Error fetching my forum comments:", error);
    return NextResponse.json(
      createErrorResponse("내가 작성한 임상포럼 댓글 목록 조회 중 오류가 발생했습니다."),
      { status: 500 }
    );
  }
});
