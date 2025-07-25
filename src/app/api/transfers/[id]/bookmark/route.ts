import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import {
  createTransferBookmark,
  removeTransferBookmark,
  checkTransferBookmarkExists,
  getTransferById,
} from "@/lib/database";

interface RouteContext {
  params: Promise<{
    id: string;
  };
}

export const POST = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const user = (request as any).user;
      const transferId = params.id;

      // 양도양수 게시글 존재 확인
      const transfer = await getTransferById(transferId);
      if (!transfer) {
        return NextResponse.json(
          createErrorResponse("양도양수 게시글을 찾을 수 없습니다"),
          { status: 404 }
        );
      }

      // 이미 북마크한 경우 확인
      const exists = await checkTransferBookmarkExists(user.userId, transferId);
      if (exists) {
        return NextResponse.json(
          createErrorResponse("이미 북마크한 게시글입니다"),
          { status: 409 }
        );
      }

      // 북마크 생성
      await createTransferBookmark(user.userId, transferId);

      return NextResponse.json(
        createApiResponse("success", "북마크가 추가되었습니다")
      );
    } catch (error) {
      console.error("Transfer bookmark create error:", error);
      return NextResponse.json(
        createErrorResponse("북마크 추가 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);

export const DELETE = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const user = (request as any).user;
      const transferId = params.id;

      // 북마크 존재 확인
      const exists = await checkTransferBookmarkExists(user.userId, transferId);
      if (!exists) {
        return NextResponse.json(
          createErrorResponse("북마크가 존재하지 않습니다"),
          { status: 404 }
        );
      }

      // 북마크 삭제
      await removeTransferBookmark(user.userId, transferId);

      return NextResponse.json(
        createApiResponse("success", "북마크가 제거되었습니다")
      );
    } catch (error) {
      console.error("Transfer bookmark delete error:", error);
      return NextResponse.json(
        createErrorResponse("북마크 제거 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);
