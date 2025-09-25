import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "로그아웃되었습니다.",
    });

    // 관리자 토큰 쿠키 삭제
    response.cookies.delete("admin-token");

    return response;
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { success: false, message: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}