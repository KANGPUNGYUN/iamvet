import { NextRequest, NextResponse } from "next/server";
import { getPasswordResetTokens } from "../find-password/route";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "토큰이 필요합니다.",
        },
        { status: 400 }
      );
    }

    // 토큰 확인
    const passwordResetTokens = getPasswordResetTokens();
    const tokenData = passwordResetTokens.get(token);

    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          message: "유효하지 않은 토큰입니다.",
        },
        { status: 400 }
      );
    }

    // 토큰 만료 확인
    if (new Date() > tokenData.expires) {
      // 만료된 토큰 삭제
      passwordResetTokens.delete(token);
      return NextResponse.json(
        {
          success: false,
          message: "토큰이 만료되었습니다.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "유효한 토큰입니다.",
    });

  } catch (error) {
    console.error("Verify reset token error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "토큰 검증 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}