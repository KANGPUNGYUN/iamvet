import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    console.log('[API] 이메일 중복확인 요청:', email);
    
    if (!email || email.trim() === "") {
      return NextResponse.json(
        { success: false, error: "이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "올바른 이메일 형식을 입력해주세요." },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} AND "isActive" = true
    `;
    
    const isDuplicate = existingUser.length > 0;
    
    console.log('[API] 이메일 중복확인 결과:', { email, isDuplicate });
    
    return NextResponse.json({
      success: true,
      isDuplicate,
      message: isDuplicate 
        ? "이미 사용 중인 이메일입니다." 
        : "사용 가능한 이메일입니다."
    });
    
  } catch (error) {
    console.error('[API] 이메일 중복확인 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "이메일 중복확인 중 오류가 발생했습니다." 
      },
      { status: 500 }
    );
  }
}