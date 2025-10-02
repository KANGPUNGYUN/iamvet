interface EmailTemplateProps {
  title: string;
  preheader: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
}

// 현재 웹 디자인과 통일된 이메일 템플릿 생성
export function generateEmailTemplate({
  title,
  preheader,
  content,
  buttonText,
  buttonUrl,
  footerText,
}: EmailTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 20px !important;
      }
      .content-wrapper {
        padding: 30px 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <!-- Preheader 텍스트 (이메일 미리보기용) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${preheader}
  </div>
  
  <!-- 이메일 컨테이너 -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table class="container" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- 헤더 -->
          <tr>
            <td style="background-color: #ff8796; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                아이엠벳
              </h1>
              <p style="margin: 5px 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                IAMVET - 수의사와 반려동물을 위한 플랫폼
              </p>
            </td>
          </tr>
          
          <!-- 콘텐츠 -->
          <tr>
            <td class="content-wrapper" style="padding: 40px 30px;">
              ${content}
              
              ${
                buttonText && buttonUrl
                  ? `
              <!-- CTA 버튼 -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="${buttonUrl}" style="display: inline-block; padding: 14px 32px; background-color: #ff8796; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; transition: background-color 0.3s;">
                      ${buttonText}
                    </a>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }
            </td>
          </tr>
          
          <!-- 푸터 -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                ${
                  footerText ||
                  "이 이메일은 아이엠벳 서비스에서 발송되었습니다."
                }
              </p>
              <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                © 2024 아이엠벳. All rights reserved.
              </p>
              <div style="margin-top: 15px;">
                <a href="${
                  process.env.NEXT_PUBLIC_SITE_URL || "https://www.iam-vet.com"
                }" style="color: #ff8796; text-decoration: none; font-size: 12px; margin: 0 10px;">홈페이지</a>
                <span style="color: #cccccc;">|</span>
                <a href="${
                  process.env.NEXT_PUBLIC_SITE_URL || "https://www.iam-vet.com"
                }/terms" style="color: #ff8796; text-decoration: none; font-size: 12px; margin: 0 10px;">이용약관</a>
                <span style="color: #cccccc;">|</span>
                <a href="${
                  process.env.NEXT_PUBLIC_SITE_URL || "https://www.iam-vet.com"
                }/privacy" style="color: #ff8796; text-decoration: none; font-size: 12px; margin: 0 10px;">개인정보처리방침</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
