import { NextRequest, NextResponse } from "next/server";
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
      return createErrorPage("Naver 로그인이 취소되었습니다", error);
    }

    if (!code || !state) {
      return createErrorPage("Naver 로그인 실패", "인증 코드가 없습니다");
    }

    // Parse and validate state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch (e) {
      return createErrorPage("Naver 로그인 실패", "유효하지 않은 상태값입니다");
    }

    const { userType } = stateData;

    // Exchange code for tokens
    const naverClientId = process.env.NAVER_CLIENT_ID;
    const naverClientSecret = process.env.NAVER_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/naver/callback`;

    if (!naverClientId || !naverClientSecret) {
      return createErrorPage(
        "Naver OAuth 설정 오류",
        "클라이언트 설정이 누락되었습니다"
      );
    }

    // Get access token from Naver
    const tokenResponse = await fetch("https://nid.naver.com/oauth2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: naverClientId,
        client_secret: naverClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        state,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      return createErrorPage(
        "Naver 로그인 실패",
        tokenData.error_description || "토큰 교환 실패"
      );
    }

    // Get user info from Naver
    const userResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const naverUserResponse = await userResponse.json();

    if (!userResponse.ok || naverUserResponse.resultcode !== "00") {
      return createErrorPage("Naver 로그인 실패", "사용자 정보 조회 실패");
    }

    const naverUser = naverUserResponse.response;

    // Check if user exists
    let user = await getUserBySocialProvider("naver", naverUser.id);
    let isNewUser = false;

    if (!user) {
      // Check if user exists with same email
      const existingUser = await getUserByEmail(naverUser.email);

      if (existingUser) {
        // Link Naver account to existing user
        await linkSocialAccount(existingUser.id, {
          provider: "naver",
          providerId: naverUser.id,
          email: naverUser.email,
          name: naverUser.name,
          profileImage: naverUser.profile_image,
        });
        user = existingUser;
      } else {
        // Create new user
        user = await createSocialUser({
          email: naverUser.email,
          name: naverUser.name,
          profileImage: naverUser.profile_image,
          userType,
          provider: "naver",
          providerId: naverUser.id,
          socialData: naverUser,
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
        name: naverUser.name,
        profileImage: naverUser.profile_image,
        provider: "naver",
        providerId: naverUser.id,
        userType: user.userType,
        nickname: naverUser.nickname,
        gender: naverUser.gender,
        ageRange: naverUser.age,
        birthday: naverUser.birthday,
        socialAccounts: user.socialAccounts || [],
      },
      tokens,
      isNewUser,
    };

    // Return success page that posts message to parent window
    return createSuccessPage("Naver 로그인 성공", responseData);
  } catch (error) {
    console.error("Naver callback error:", error);
    return createErrorPage("Naver 로그인 실패", "서버 오류가 발생했습니다");
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
