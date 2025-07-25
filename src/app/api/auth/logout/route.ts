import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          status: "error",
          message: "인증 토큰이 없습니다",
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // TODO: Add token to blacklist or invalidate in your auth system
    // This depends on your authentication implementation
    // For now, we'll just clear any cookies and return success

    // Clear any authentication cookies
    const cookieStore = cookies();
    const response = NextResponse.json(
      {
        status: "success",
        message: "로그아웃되었습니다",
      },
      { status: 200 }
    );

    // Clear authentication cookies
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    return response;

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "로그아웃 처리 중 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}