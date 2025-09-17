import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/AuthService";

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

    console.log("Google OAuth user data:", googleUser);
    console.log("Processed userType:", userType);
    
    // Extract real name, phone, and birth date from Google user data
    // Google OAuth v2 API doesn't provide phone number or birth date by default
    // Real name is usually the same as the display name
    const realName = googleUser.name || undefined;
    const phone = undefined; // Google OAuth v2 doesn't provide phone number
    const birthDate = undefined; // Google OAuth v2 doesn't provide birth date by default
    
    // Use AuthService to handle social authentication
    const authResult = await AuthService.handleSocialAuth({
      email: googleUser.email,
      name: googleUser.name,
      realName,
      phone,
      birthDate,
      profileImage: googleUser.picture,
      userType,
      provider: "GOOGLE",
      providerId: googleUser.id,
      socialData: googleUser,
    });

    console.log("AuthService result:", authResult);

    if (!authResult.success || !authResult.data) {
      console.error("AuthService failed:", authResult.error);
      return createErrorPage(
        "Google 로그인 실패",
        authResult.error || "인증 처리 실패"
      );
    }

    const responseData = authResult.data;

    // Handle new user case - redirect to registration completion
    if (
      responseData.isNewUser &&
      !responseData.user &&
      responseData.socialData
    ) {
      const socialData = responseData.socialData;
      const registrationUrl = `/register/social-complete/${userType}?email=${encodeURIComponent(
        socialData.email
      )}&name=${encodeURIComponent(
        socialData.name
      )}&profileImage=${encodeURIComponent(
        socialData.profileImage || ""
      )}&provider=${socialData.provider}&providerId=${encodeURIComponent(
        socialData.providerId
      )}`;

      return NextResponse.redirect(new URL(registrationUrl, request.url));
    }

    // Return success page that posts message to parent window
    return createSuccessPage("Google 로그인 성공", responseData);
  } catch (error) {
    console.error("Google callback error:", error);
    return createErrorPage("Google 로그인 실패", "서버 오류가 발생했습니다");
  }
}

function createSuccessPage(message: string, data: any) {
  // Generate redirect URL using AuthService
  const userType = data.user?.userType || data.socialData?.userType;
  const redirectUrl = AuthService.generateRedirectUrl(
    data.isProfileComplete,
    userType,
    data.isProfileComplete
      ? undefined
      : data.user
      ? {
          email: data.user.email,
          name: data.user.name,
          profileImage: data.user.profileImage,
        }
      : data.socialData
  );

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
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
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
              type: 'SOCIAL_LOGIN_SUCCESS',
              data: ${JSON.stringify(data)}
            }, window.location.origin);
            
            // Close popup after a small delay to ensure message is received
            setTimeout(function() {
              try {
                window.close();
              } catch (e) {
                // Ignore close errors
              }
            }, 100);
          } else {
            // If not in popup or opener is closed, redirect using AuthService generated URL
            if (${JSON.stringify(data.tokens)}) {
              localStorage.setItem('accessToken', '${data.tokens?.accessToken || ''}');
              localStorage.setItem('refreshToken', '${data.tokens?.refreshToken || ''}');
              localStorage.setItem('user', JSON.stringify(${JSON.stringify(
                data.user
              )}));
              
              // 토큰을 쿠키로도 동기화
              const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
              document.cookie = 'auth-token=${data.tokens?.accessToken || ''}; expires=' + expireDate.toUTCString() + '; path=/; secure; samesite=strict';
            }
            
            window.location.href = '${redirectUrl}';
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          // Fallback to redirect flow
          if (${JSON.stringify(data.tokens)}) {
            localStorage.setItem('accessToken', '${data.tokens?.accessToken || ''}');
            localStorage.setItem('refreshToken', '${data.tokens?.refreshToken || ''}');
            localStorage.setItem('user', JSON.stringify(${JSON.stringify(
              data.user
            )}));
            
            // 토큰을 쿠키로도 동기화
            const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            document.cookie = 'auth-token=${data.tokens?.accessToken || ''}; expires=' + expireDate.toUTCString() + '; path=/; secure; samesite=strict';
          }
          
          window.location.href = '${redirectUrl}';
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
      <meta charset="UTF-8">
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
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
              type: 'SOCIAL_LOGIN_ERROR',
              message: '${message}',
              error: '${error}'
            }, window.location.origin);
            
            setTimeout(function() {
              try {
                window.close();
              } catch (e) {
                // Ignore close errors
              }
            }, 3000);
          } else {
            setTimeout(function() {
              window.location.href = '/member-select';
            }, 3000);
          }
        } catch (error) {
          console.error('OAuth error callback error:', error);
          setTimeout(function() {
            window.location.href = '/member-select';
          }, 3000);
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
