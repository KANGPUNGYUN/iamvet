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
      return createErrorPage("Kakao 로그인이 취소되었습니다", error);
    }

    if (!code || !state) {
      return createErrorPage("Kakao 로그인 실패", "인증 코드가 없습니다");
    }

    // Parse and validate state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch (e) {
      return createErrorPage("Kakao 로그인 실패", "유효하지 않은 상태값입니다");
    }

    const { userType } = stateData;

    // Exchange code for tokens
    const kakaoClientId = process.env.KAKAO_CLIENT_ID;
    const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/kakao/callback`;

    if (!kakaoClientId || !kakaoClientSecret) {
      return createErrorPage(
        "Kakao OAuth 설정 오류",
        "클라이언트 설정이 누락되었습니다"
      );
    }

    // Get access token from Kakao
    const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: kakaoClientId,
        client_secret: kakaoClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      return createErrorPage(
        "Kakao 로그인 실패",
        tokenData.error_description || "토큰 교환 실패"
      );
    }

    // Get user info from Kakao
    const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const kakaoUser = await userResponse.json();

    if (!userResponse.ok || kakaoUser.error) {
      return createErrorPage("Kakao 로그인 실패", "사용자 정보 조회 실패");
    }

    const profile = kakaoUser.kakao_account?.profile || {};
    const email = kakaoUser.kakao_account?.email;

    if (!email) {
      return createErrorPage("Kakao 로그인 실패", "이메일 정보가 필요합니다");
    }

    // Check if user exists
    let user = await getUserBySocialProvider("kakao", kakaoUser.id.toString());
    let isNewUser = false;

    if (!user) {
      // Check if user exists with same email
      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        // Link Kakao account to existing user
        await linkSocialAccount(existingUser.id, {
          provider: "kakao",
          providerId: kakaoUser.id.toString(),
          email: email,
          name: profile.nickname || email.split("@")[0],
          profileImage: profile.profile_image_url,
        });
        user = existingUser;
      } else {
        // Create new user
        user = await createSocialUser({
          email: email,
          name: profile.nickname || email.split("@")[0],
          profileImage: profile.profile_image_url,
          userType,
          provider: "kakao",
          providerId: kakaoUser.id.toString(),
          socialData: kakaoUser,
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
        email: email,
        name: profile.nickname || email.split("@")[0],
        profileImage: profile.profile_image_url,
        provider: "kakao",
        providerId: kakaoUser.id.toString(),
        userType: user.userType,
        nickname: profile.nickname,
        ageRange: kakaoUser.kakao_account?.age_range,
        birthday: kakaoUser.kakao_account?.birthday,
        gender: kakaoUser.kakao_account?.gender,
        socialAccounts: user.socialAccounts || [],
      },
      tokens,
      isNewUser,
    };

    // Return success page that posts message to parent window
    return createSuccessPage("Kakao 로그인 성공", responseData);
  } catch (error) {
    console.error("Kakao callback error:", error);
    return createErrorPage("Kakao 로그인 실패", "서버 오류가 발생했습니다");
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
