import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userType = formData.get("userType") as string;

    // Validate userType
    if (!userType || !["veterinarian", "hospital"].includes(userType)) {
      return NextResponse.json(
        {
          status: "error",
          message: "유효한 사용자 타입이 필요합니다 (veterinarian 또는 hospital)",
        },
        { status: 400 }
      );
    }

    // Remove userType from formData before forwarding
    formData.delete("userType");

    // Forward the request to appropriate registration endpoint
    const targetUrl = `/api/register/${userType}`;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}${targetUrl}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error("Unified register error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "회원가입 처리 중 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}