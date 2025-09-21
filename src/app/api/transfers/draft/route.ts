import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { getDraftTransferByUserId } from "@/lib/database";

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // 사용자의 임시저장된 양수양도 조회
    const draftTransfer = await getDraftTransferByUserId(user.userId);
    
    return NextResponse.json(
      createApiResponse("success", "임시저장 양수양도 조회 성공", { 
        hasDraft: !!draftTransfer,
        draft: draftTransfer 
      })
    );
  } catch (error) {
    console.error("Draft transfer fetch error:", error);
    return NextResponse.json(
      createErrorResponse("임시저장 양수양도 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
});