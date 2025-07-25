import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import {
  getForumById,
  updateForum,
  deleteForum,
  incrementForumViewCount,
  getForumComments,
} from "@/lib/database";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const forumId = params.id;

    // 임상포럼 게시글 조회
    const forum = await getForumById(forumId);
    if (!forum) {
      return NextResponse.json(
        createErrorResponse("임상포럼 게시글을 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    // 조회수 증가 (IP 기반)
    const userIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip");
    await incrementForumViewCount(forumId, userIp);

    // 댓글 조회
    const comments = await getForumComments(forumId);

    const forumDetail = {
      ...forum,
      comments,
    };

    return NextResponse.json(
      createApiResponse("success", "임상포럼 게시글 조회 성공", forumDetail)
    );
  } catch (error) {
    console.error("Forum detail error:", error);
    return NextResponse.json(
      createErrorResponse("임상포럼 게시글 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export const PUT = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const user = (request as any).user;
      const params = await context.params;
      const forumId = params.id;
      const updateData = await request.json();

      // 임상포럼 게시글 존재 및 권한 확인
      const forum = await getForumById(forumId);
      if (!forum) {
        return NextResponse.json(
          createErrorResponse("임상포럼 게시글을 찾을 수 없습니다"),
          { status: 404 }
        );
      }

      if (forum.userId !== user.userId) {
        return NextResponse.json(
          createErrorResponse("이 게시글을 수정할 권한이 없습니다"),
          { status: 403 }
        );
      }

      // 게시글 수정
      const updatedForum = await updateForum(forumId, updateData);

      return NextResponse.json(
        createApiResponse(
          "success",
          "임상포럼 게시글이 수정되었습니다",
          updatedForum
        )
      );
    } catch (error) {
      console.error("Forum update error:", error);
      return NextResponse.json(
        createErrorResponse("임상포럼 게시글 수정 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);

export const DELETE = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const user = (request as any).user;
      const params = await context.params;
      const forumId = params.id;

      // 임상포럼 게시글 존재 및 권한 확인
      const forum = await getForumById(forumId);
      if (!forum) {
        return NextResponse.json(
          createErrorResponse("임상포럼 게시글을 찾을 수 없습니다"),
          { status: 404 }
        );
      }

      if (forum.userId !== user.userId) {
        return NextResponse.json(
          createErrorResponse("이 게시글을 삭제할 권한이 없습니다"),
          { status: 403 }
        );
      }

      // 게시글 삭제
      await deleteForum(forumId);

      return NextResponse.json(
        createApiResponse("success", "임상포럼 게시글이 삭제되었습니다")
      );
    } catch (error) {
      console.error("Forum delete error:", error);
      return NextResponse.json(
        createErrorResponse("임상포럼 게시글 삭제 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);
