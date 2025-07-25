import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createErrorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get("userType") || "veterinarian";

    // Validate userType
    if (!["veterinarian", "hospital"].includes(userType)) {
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

    // Google OAuth URLs
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    if (!googleClientId) {
      return NextResponse.json(
        createErrorResponse("Google OAuth 설정이 누락되었습니다"),
        { status: 500 }
      );
    }

    // Build Google OAuth URL
    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );
    googleAuthUrl.searchParams.set("client_id", googleClientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "profile email");
    googleAuthUrl.searchParams.set("state", state);
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "select_account");

    // Redirect to Google OAuth
    return NextResponse.redirect(googleAuthUrl.toString());
  } catch (error) {
    console.error("Google login redirect error:", error);
    return NextResponse.json(
      createErrorResponse("Google 로그인 페이지로 이동 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
