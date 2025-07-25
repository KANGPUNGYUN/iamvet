import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, createErrorResponse } from "@/src/lib/api";
import {
  getUserByEmail,
  getUserBySocialProvider,
  createSocialUser,
  linkSocialAccount,
  generateTokens,
} from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      return createErrorPage("Google 로그인이 취소되었습니다", error);
    }

    if (!code || !state) {
      return createErrorPage("Google 로그인 실패", "인증 코드가 없습니다");
    }

    // Parse and validate state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch (e) {
      return createErrorPage(
        "Google 로그인 실패",
        "유효하지 않은 상태값입니다"
      );
    }

    const { userType } = stateData;

    // Exchange code for tokens
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    if (!googleClientId || !googleClientSecret) {
      return createErrorPage(
        "Google OAuth 설정 오류",
        "클라이언트 설정이 누락되었습니다"
      );
    }

    // Get access token from Google
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return createErrorPage(
        "Google 로그인 실패",
        tokenData.error_description || "토큰 교환 실패"
      );
    }

    // Get user info from Google
    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`
    );

    const googleUser = await userResponse.json();

    if (!userResponse.ok) {
      return createErrorPage("Google 로그인 실패", "사용자 정보 조회 실패");
    }

    // Check if user exists
    let user = await getUserBySocialProvider("google", googleUser.id);
    let isNewUser = false;

    if (!user) {
      // Check if user exists with same email
      const existingUser = await getUserByEmail(googleUser.email);

      if (existingUser) {
        // Link Google account to existing user
        await linkSocialAccount(existingUser.id, {
          provider: "google",
          providerId: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          profileImage: googleUser.picture,
        });
        user = existingUser;
      } else {
        // Create new user
        user = await createSocialUser({
          email: googleUser.email,
          name: googleUser.name,
          profileImage: googleUser.picture,
          userType,
          provider: "google",
          providerId: googleUser.id,
          socialData: googleUser,
        });
        isNewUser = true;
      }
    }

    // Generate JWT tokens
    const tokens = await generateTokens(user);

    // Create success response data
    const responseData = {
      user: {
        id: user.id,
        email: user.email,
        name: googleUser.name,
        profileImage: googleUser.picture,
        provider: "google",
        providerId: googleUser.id,
        userType: user.userType,
        socialAccounts: user.socialAccounts || [],
      },
      tokens,
      isNewUser,
    };

    // Return success page that posts message to parent window
    return createSuccessPage("Google 로그인 성공", responseData);
  } catch (error) {
    console.error("Google callback error:", error);
    return createErrorPage("Google 로그인 실패", "서버 오류가 발생했습니다");
  }
}

function createSuccessPage(message: string, data: any) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>로그인 성공</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .success { color: green; }
      </style>
    </head>
    <body>
      <h2 class="success">${message}</h2>
      <p>로그인이 완료되었습니다. 잠시 후 자동으로 닫힙니다.</p>
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'SOCIAL_LOGIN_SUCCESS',
            data: ${JSON.stringify(data)}
          }, window.location.origin);
          window.close();
        } else {
          // If not in popup, redirect to dashboard
          localStorage.setItem('accessToken', '${data.tokens.accessToken}');
          localStorage.setItem('refreshToken', '${data.tokens.refreshToken}');
          localStorage.setItem('user', JSON.stringify(${JSON.stringify(
            data.user
          )}));
          window.location.href = '/${
            data.user.userType === "hospital"
              ? "dashboard/hospital"
              : "dashboard/veterinarian"
          }';
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

function createErrorPage(message: string, error: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>로그인 실패</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .error { color: red; }
      </style>
    </head>
    <body>
      <h2 class="error">${message}</h2>
      <p>${error}</p>
      <button onclick="window.close()">닫기</button>
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'SOCIAL_LOGIN_ERROR',
            message: '${message}',
            error: '${error}'
          }, window.location.origin);
          setTimeout(() => window.close(), 3000);
        } else {
          setTimeout(() => window.location.href = '/login', 3000);
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
