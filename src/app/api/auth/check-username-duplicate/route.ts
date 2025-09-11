import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    
    console.log('[API] 아이디 중복확인 요청:', username);
    
    if (!username || username.trim() === "") {
      return NextResponse.json(
        { success: false, error: "아이디를 입력해주세요." },
        { status: 400 }
      );
    }

    // 아이디 중복 확인
    const existingUser = await sql`
      SELECT id FROM users WHERE username = ${username} AND "isActive" = true
    `;
    
    const isDuplicate = existingUser.length > 0;
    
    console.log('[API] 아이디 중복확인 결과:', { username, isDuplicate });
    
    return NextResponse.json({
      success: true,
      isDuplicate,
      message: isDuplicate 
        ? "이미 사용 중인 아이디입니다." 
        : "사용 가능한 아이디입니다."
    });
    
  } catch (error) {
    console.error('[API] 아이디 중복확인 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "아이디 중복확인 중 오류가 발생했습니다." 
      },
      { status: 500 }
    );
  }
}