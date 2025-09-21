import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { 
  getForumCommentById,
  updateForumComment,
  deleteForumComment
} from "@/lib/database";

interface RouteContext {
  params: Promise<{
    id: string;
    commentId: string;
  }>;
}

// 댓글 수정 (로그인 필요)
export const PUT = withAuth(async (request: NextRequest, context: RouteContext) => {
  try {
    const user = (request as any).user;
    const params = await context.params;
    const commentId = params.commentId;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        createErrorResponse("댓글 내용을 입력해주세요"),
        { status: 400 }
      );
    }

    // 댓글 존재 및 권한 확인
    const comment = await getForumCommentById(commentId);
    if (!comment) {
      return NextResponse.json(
        createErrorResponse("댓글을 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    if (comment.user_id !== user.userId) {
      return NextResponse.json(
        createErrorResponse("이 댓글을 수정할 권한이 없습니다"),
        { status: 403 }
      );
    }

    // 댓글 수정
    const updatedComment = await updateForumComment(commentId, content.trim(), user.userId);
    
    if (!updatedComment) {
      return NextResponse.json(
        createErrorResponse("댓글 수정에 실패했습니다"),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createApiResponse("success", "댓글이 수정되었습니다", updatedComment)
    );
  } catch (error) {
    console.error("Comment update error:", error);
    return NextResponse.json(
      createErrorResponse("댓글 수정 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});

// 댓글 삭제 (로그인 필요)
export const DELETE = withAuth(async (request: NextRequest, context: RouteContext) => {
  try {
    const user = (request as any).user;
    const params = await context.params;
    const commentId = params.commentId;

    // 댓글 존재 및 권한 확인
    const comment = await getForumCommentById(commentId);
    if (!comment) {
      return NextResponse.json(
        createErrorResponse("댓글을 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    if (comment.user_id !== user.userId) {
      return NextResponse.json(
        createErrorResponse("이 댓글을 삭제할 권한이 없습니다"),
        { status: 403 }
      );
    }

    // 댓글 삭제
    const deletedComment = await deleteForumComment(commentId, user.userId);
    
    if (!deletedComment) {
      return NextResponse.json(
        createErrorResponse("댓글 삭제에 실패했습니다"),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createApiResponse("success", "댓글이 삭제되었습니다")
    );
  } catch (error) {
    console.error("Comment delete error:", error);
    return NextResponse.json(
      createErrorResponse("댓글 삭제 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});