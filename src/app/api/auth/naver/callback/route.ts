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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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

    // Extract real name, phone, and birth date from Naver user data
    const realName = naverUser.name || undefined;
    const phone = naverUser.mobile || undefined;

    // Extract birth date from Naver user data
    // Naver can provide birthday in various formats: YYYY-MM-DD, MM-DD, or separate fields
    let birthDate = undefined;

    if (naverUser.birthday) {
      const birthday = naverUser.birthday;

      // Check if birthday already includes year (YYYY-MM-DD format)
      if (birthday.length === 10 && birthday.includes("-")) {
        birthDate = birthday;
      } else if (birthday.length === 5 && birthday.includes("-")) {
        // MM-DD format, check if we have birthyear
        if (naverUser.birthyear) {
          birthDate = `${naverUser.birthyear}-${birthday}`;
        }
      }
    }

    console.log("Naver OAuth user data:", naverUser);
    console.log("Extracted realName:", realName);
    console.log("Extracted phone:", phone);
    console.log("Extracted birthDate:", birthDate);

    // Use AuthService to handle social authentication
    const authResult = await AuthService.handleSocialAuth({
      email: naverUser.email,
      name: naverUser.name,
      realName,
      phone,
      birthDate,
      profileImage: naverUser.profile_image,
      userType,
      provider: "NAVER",
      providerId: naverUser.id,
      socialData: naverUser,
    });

    if (!authResult.success) {
      // Check if it's an existing account error
      if (authResult.error === "EXISTING_ACCOUNT" && authResult.data) {
        return createExistingAccountPage(authResult.data);
      }
      
      return createErrorPage(
        "Naver 로그인 실패",
        authResult.message || "인증 처리 실패"
      );
    }
    
    if (!authResult.data) {
      return createErrorPage(
        "Naver 로그인 실패",
        "인증 데이터 오류"
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
    return createSuccessPage("Naver 로그인 성공", responseData);
  } catch (error) {
    console.error("Naver callback error:", error);
    return createErrorPage("Naver 로그인 실패", "서버 오류가 발생했습니다");
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
            
            setTimeout(function() {
              try {
                window.close();
              } catch (e) {
                // Ignore close errors
              }
            }, 100);
          } else {
            localStorage.setItem('accessToken', '${data.tokens.accessToken}');
            localStorage.setItem('refreshToken', '${data.tokens.refreshToken}');
            localStorage.setItem('user', JSON.stringify(${JSON.stringify(
              data.user
            )}));
            
            // 토큰을 쿠키로도 동기화
            const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const isProduction = window.location.hostname !== 'localhost';
            const secureFlag = isProduction ? '; secure' : '';
            document.cookie = 'auth-token=${
              data.tokens.accessToken
            }; expires=' + expireDate.toUTCString() + '; path=/; samesite=strict' + secureFlag;
            
            // 인증 상태 강제 업데이트를 위한 이벤트 발생
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'accessToken',
              newValue: '${data.tokens.accessToken}',
              url: window.location.href
            }));
            
            // 리다이렉트 시 auth 파라미터 추가로 상태 갱신 트리거
            window.location.href = '${redirectUrl}' + (window.location.href.includes('?') ? '&' : '?') + 'auth=success';
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          localStorage.setItem('accessToken', '${data.tokens.accessToken}');
          localStorage.setItem('refreshToken', '${data.tokens.refreshToken}');
          localStorage.setItem('user', JSON.stringify(${JSON.stringify(
            data.user
          )}));
          
          // 토큰을 쿠키로도 동기화
          const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          const isProduction = window.location.hostname !== 'localhost';
          const secureFlag = isProduction ? '; secure' : '';
          document.cookie = 'auth-token=${
            data.tokens.accessToken
          }; expires=' + expireDate.toUTCString() + '; path=/; samesite=strict' + secureFlag;
          
          // 인증 상태 강제 업데이트를 위한 이벤트 발생
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'accessToken',
            newValue: '${data.tokens.accessToken}',
            url: window.location.href
          }));
          
          // 리다이렉트 시 auth 파라미터 추가로 상태 갔9신 트리거
          window.location.href = '${redirectUrl}' + (window.location.href.includes('?') ? '&' : '?') + 'auth=success';
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

function createExistingAccountPage(data: any) {
  const providerNames = {
    GOOGLE: '구글',
    KAKAO: '카카오',
    NAVER: '네이버'
  };
  
  const attemptedProviderName = providerNames[data.attemptedProvider as keyof typeof providerNames] || data.attemptedProvider;
  
  let loginMethods = [];
  if (data.hasPassword) {
    loginMethods.push('일반 로그인(이메일/비밀번호)');
  }
  
  const socialProviders = (data.existingProviders || []).map((p: string) => 
    `${providerNames[p as keyof typeof providerNames] || p} 로그인`
  );
  loginMethods = [...loginMethods, ...socialProviders];
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>이미 가입된 계정</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .warning { 
          color: #ff6b6b;
          font-size: 18px;
          margin-bottom: 20px;
        }
        .email {
          font-weight: bold;
          color: #333;
          margin: 10px 0;
        }
        .methods {
          background: #f8f9fa;
          border-radius: 4px;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
        }
        .methods h4 {
          margin: 0 0 10px 0;
          color: #333;
        }
        .methods ul {
          margin: 0;
          padding-left: 20px;
        }
        .methods li {
          margin: 5px 0;
          color: #666;
        }
        .button {
          background: #FF8796;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
        }
        .button:hover {
          background: #ff6b7d;
        }
        .info {
          color: #666;
          font-size: 14px;
          margin-top: 20px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2 class="warning">이미 가입된 계정입니다</h2>
        <p class="email">${data.email}</p>
        <p>${attemptedProviderName}로 로그인을 시도하셨지만,<br>해당 이메일로 이미 가입된 계정이 있습니다.</p>
        
        <div class="methods">
          <h4>기존 로그인 방법:</h4>
          <ul>
            ${loginMethods.map(method => `<li>${method}</li>`).join('')}
          </ul>
        </div>
        
        <p class="info">
          위의 방법으로 로그인해주세요.<br>
          비밀번호를 잊으셨다면 로그인 페이지에서<br>
          '비밀번호 찾기'를 이용해주세요.
        </p>
        
        <button class="button" onclick="closeAndRedirect()">로그인 페이지로 이동</button>
      </div>
      
      <script>
        function closeAndRedirect() {
          try {
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage({
                type: 'SOCIAL_LOGIN_ERROR',
                error: 'EXISTING_ACCOUNT',
                data: ${JSON.stringify(data)}
              }, window.location.origin);
              
              setTimeout(function() {
                window.close();
              }, 100);
            } else {
              window.location.href = '/member-select';
            }
          } catch (error) {
            window.location.href = '/member-select';
          }
        }
        
        // 5초 후 자동으로 로그인 페이지로 이동
        setTimeout(closeAndRedirect, 5000);
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
