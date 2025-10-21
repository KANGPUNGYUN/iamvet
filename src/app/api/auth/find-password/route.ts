import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// 임시로 메모리에 저장 (실제로는 데이터베이스에 저장해야 함)
const passwordResetTokens = new Map<string, { email: string; expires: Date }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // 이메일 검증
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "이메일을 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "올바른 이메일 형식을 입력해주세요.",
        },
        { status: 400 }
      );
    }

    // TODO: 실제로는 데이터베이스에서 사용자 존재 여부 확인
    // 현재는 모든 이메일에 대해 성공 응답 (보안상 이유로)
    
    // 토큰 생성
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15분 후 만료

    // 토큰 저장 (실제로는 데이터베이스에 저장)
    passwordResetTokens.set(token, { email, expires });

    // 이메일 전송 (실제로는 nodemailer 등을 사용)
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    // TODO: 실제 이메일 전송 로직 구현
    console.log(`비밀번호 재설정 링크: ${resetUrl}`);
    console.log(`이메일: ${email}`);

    // 성공 응답 (실제 구현 시에는 이메일 전송 결과에 따라 응답)
    return NextResponse.json({
      success: true,
      message: "비밀번호 재설정 이메일이 전송되었습니다.",
    });

  } catch (error) {
    console.error("Find password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 }
    );
  }
}

// 토큰 검증용 함수 (다른 API에서 사용)
export function getPasswordResetTokens() {
  return passwordResetTokens;
}