import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createApiResponse, createErrorResponse } from "@/lib/utils";
import { softDeleteUser, softDeleteUserData } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(createErrorResponse("인증이 필요합니다"), {
        status: 401,
      });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        createErrorResponse("유효하지 않은 토큰입니다"),
        { status: 401 }
      );
    }

    const { reason } = await request.json();

    // Soft delete: 계정을 삭제하지 않고 deleted_at 필드만 설정
    const deletedUser = await softDeleteUser(decoded.userId, reason);

    // 관련 데이터도 soft delete 처리
    await softDeleteUserData(decoded.userId);

    return NextResponse.json(
      createApiResponse("success", "회원 탈퇴가 완료되었습니다", {
        deletedAt: deletedUser.deletedAt,
        message:
          "계정은 3개월간 보관되며, 같은 휴대폰번호로 재가입 시 복구할 수 있습니다",
      })
    );
  } catch (error) {
    console.error("Withdraw error:", error);
    return NextResponse.json(
      createErrorResponse("탈퇴 처리 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}

