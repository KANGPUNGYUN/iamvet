import { NextRequest, NextResponse } from "next/server";
import { getPasswordResetTokens } from "../find-password/route";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "토큰과 비밀번호가 필요합니다.",
        },
        { status: 400 }
      );
    }

    // 비밀번호 유효성 검사
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return NextResponse.json(
        {
          success: false,
          message: "비밀번호는 최소 8자 이상이어야 합니다.",
        },
        { status: 400 }
      );
    }

    if (!hasUpperCase || !hasLowerCase) {
      return NextResponse.json(
        {
          success: false,
          message: "비밀번호는 대문자와 소문자를 포함해야 합니다.",
        },
        { status: 400 }
      );
    }

    if (!hasNumbers) {
      return NextResponse.json(
        {
          success: false,
          message: "비밀번호는 숫자를 포함해야 합니다.",
        },
        { status: 400 }
      );
    }

    if (!hasSpecialChar) {
      return NextResponse.json(
        {
          success: false,
          message: "비밀번호는 특수문자를 포함해야 합니다.",
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

    // TODO: 실제로는 데이터베이스에서 사용자의 비밀번호를 업데이트
    // const hashedPassword = await bcrypt.hash(password, 10);
    // await updateUserPassword(tokenData.email, hashedPassword);
    
    console.log(`비밀번호 재설정 완료: ${tokenData.email}`);

    // 사용된 토큰 삭제
    passwordResetTokens.delete(token);

    return NextResponse.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "비밀번호 재설정 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}