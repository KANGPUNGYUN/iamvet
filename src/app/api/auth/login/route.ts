import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, userType } = body;

    // Validate required fields
    if (!username || !password || !userType) {
      return NextResponse.json(
        {
          status: "error",
          message: "사용자명, 비밀번호, 사용자 타입이 필요합니다",
        },
        { status: 400 }
      );
    }

    // Validate userType
    if (!["veterinarian", "hospital"].includes(userType)) {
      return NextResponse.json(
        {
          status: "error",
          message: "유효하지 않은 사용자 타입입니다",
        },
        { status: 400 }
      );
    }

    // Redirect to appropriate login endpoint based on userType
    const targetUrl = `/api/login/${userType}`;
    
    // Forward the request to the specific login endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}${targetUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error("Unified login error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "로그인 처리 중 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}