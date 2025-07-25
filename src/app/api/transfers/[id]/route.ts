import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import {
  getTransferById,
  updateTransfer,
  deleteTransfer,
  incrementTransferViewCount,
  getRelatedTransfers,
} from "@/lib/database";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const transferId = params.id;

    // 양도양수 게시글 조회
    const transfer = await getTransferById(transferId);
    if (!transfer) {
      return NextResponse.json(
        createErrorResponse("양도양수 게시글을 찾을 수 없습니다"),
        { status: 404 }
      );
    }

    // 조회수 증가 (IP 기반)
    const userIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip");
    await incrementTransferViewCount(transferId, userIp);

    // 관련 양도양수 게시글
    const relatedTransfers = await getRelatedTransfers(
      transferId,
      transfer.transferType,
      5
    );

    const transferDetail = {
      ...transfer,
      relatedTransfers,
    };

    return NextResponse.json(
      createApiResponse("success", "양도양수 게시글 조회 성공", transferDetail)
    );
  } catch (error) {
    console.error("Transfer detail error:", error);
    return NextResponse.json(
      createErrorResponse("양도양수 게시글 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

export const PUT = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const user = (request as any).user;
      const transferId = params.id;
      const updateData = await request.json();

      // 양도양수 게시글 존재 및 권한 확인
      const transfer = await getTransferById(transferId);
      if (!transfer) {
        return NextResponse.json(
          createErrorResponse("양도양수 게시글을 찾을 수 없습니다"),
          { status: 404 }
        );
      }

      if (transfer.userId !== user.userId) {
        return NextResponse.json(
          createErrorResponse("이 게시글을 수정할 권한이 없습니다"),
          { status: 403 }
        );
      }

      // 게시글 수정
      const updatedTransfer = await updateTransfer(transferId, updateData);

      return NextResponse.json(
        createApiResponse(
          "success",
          "양도양수 게시글이 수정되었습니다",
          updatedTransfer
        )
      );
    } catch (error) {
      console.error("Transfer update error:", error);
      return NextResponse.json(
        createErrorResponse("양도양수 게시글 수정 중 오류가 발생했습니다"),
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

      // 양도양수 게시글 존재 및 권한 확인
      const transfer = await getTransferById(transferId);
      if (!transfer) {
        return NextResponse.json(
          createErrorResponse("양도양수 게시글을 찾을 수 없습니다"),
          { status: 404 }
        );
      }

      if (transfer.userId !== user.userId) {
        return NextResponse.json(
          createErrorResponse("이 게시글을 삭제할 권한이 없습니다"),
          { status: 403 }
        );
      }

      // 게시글 삭제
      await deleteTransfer(transferId);

      return NextResponse.json(
        createApiResponse("success", "양도양수 게시글이 삭제되었습니다")
      );
    } catch (error) {
      console.error("Transfer delete error:", error);
      return NextResponse.json(
        createErrorResponse("양도양수 게시글 삭제 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  }
);
