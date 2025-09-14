import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get("userType") || "veterinarian";

    // Validate userType
    if (!["veterinarian", "hospital", "veterinary-student"].includes(userType)) {
      return NextResponse.json(
        createErrorResponse("유효하지 않은 사용자 타입입니다"),
        { status: 400 }
      );
    }

    // Generate state parameter for CSRF protection
    const state = Buffer.from(
      JSON.stringify({
        userType,
        timestamp: Date.now(),
        random: Math.random().toString(36).substring(7),
      })
    ).toString("base64");

    // Naver OAuth URLs
    const naverClientId = process.env.NAVER_CLIENT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/naver/callback`;

    if (!naverClientId) {
      return NextResponse.json(
        createErrorResponse("Naver OAuth 설정이 누락되었습니다"),
        { status: 500 }
      );
    }

    // Build Naver OAuth URL
    const naverAuthUrl = new URL("https://nid.naver.com/oauth2.0/authorize");
    naverAuthUrl.searchParams.set("client_id", naverClientId);
    naverAuthUrl.searchParams.set("redirect_uri", redirectUri);
    naverAuthUrl.searchParams.set("response_type", "code");
    naverAuthUrl.searchParams.set("scope", "profile email");
    naverAuthUrl.searchParams.set("state", state);

    // Redirect to Naver OAuth
    return NextResponse.redirect(naverAuthUrl.toString());
  } catch (error) {
    console.error("Naver login redirect error:", error);
    return NextResponse.json(
      createErrorResponse("Naver 로그인 페이지로 이동 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
