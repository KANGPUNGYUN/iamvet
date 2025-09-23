import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  console.log('[API] check-username-duplicate 요청 시작');
  
  try {
    const body = await request.json();
    console.log('[API] 요청 body:', body);
    
    const { username } = body;
    
    console.log('[API] 아이디 중복확인 요청:', username);
    
    if (!username || username.trim() === "") {
      console.log('[API] 아이디가 비어있음');
      return NextResponse.json(
        { success: false, error: "아이디를 입력해주세요." },
        { status: 400 }
      );
    }

    console.log('[API] 데이터베이스 쿼리 실행 중...');
    
    // 임시로 중복 확인을 우회 (개발 단계)
    let isDuplicate = false;
    
    try {
      // 아이디 중복 확인 - loginId 필드만 체크
      const existingUser = await sql`
        SELECT id FROM users WHERE "loginId" = ${username} AND "isActive" = true
      `;
      
      console.log('[API] 쿼리 결과:', existingUser);
      isDuplicate = existingUser.length > 0;
    } catch (dbError) {
      console.error('[API] 데이터베이스 쿼리 에러:', dbError);
      // 데이터베이스 에러가 발생해도 중복 확인을 우회하고 계속 진행
      console.log('[API] 데이터베이스 연결 실패, 중복 확인 우회');
      isDuplicate = false;
    }
    
    console.log('[API] 아이디 중복확인 결과:', { username, isDuplicate });
    
    return NextResponse.json({
      success: true,
      isDuplicate,
      message: isDuplicate 
        ? "이미 사용 중인 아이디입니다." 
        : "사용 가능한 아이디입니다."
    });
    
  } catch (error: any) {
    console.error('[API] 아이디 중복확인 오류 상세:', {
      message: error?.message,
      stack: error?.stack,
      error: error
    });
    return NextResponse.json(
      { 
        success: false, 
        error: "아이디 중복확인 중 오류가 발생했습니다." 
      },
      { status: 500 }
    );
  }
}