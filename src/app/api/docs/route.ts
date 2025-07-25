// src/app/api/docs/route.ts
// Swagger UI를 위한 API route

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 배포환경에 맞는 URL 설정
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
                  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  request.nextUrl.origin;

  const simpleSwaggerHTML = `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수의사 채용 플랫폼 API</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
    <style>
      html {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }
      *, *:before, *:after {
        box-sizing: inherit;
      }
      body {
        margin:0;
        background: #fafafa;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-standalone-preset.js"></script>
    <script>
    window.onload = function() {
      // 배포환경과 로컬환경 모두 지원하는 URL 처리
      const getApiUrl = () => {
        const origin = window.location.origin;
        const hostname = window.location.hostname;
        
        // Vercel 배포환경 감지
        if (hostname.includes('vercel.app') || hostname.includes('iamvet')) {
          return origin + '/api/docs/openapi.json';
        }
        
        // 로컬 개발환경
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return origin + '/api/docs/openapi.json';
        }
        
        // 기본값
        return '${baseUrl}/api/docs/openapi.json';
      };

      const ui = SwaggerUIBundle({
        url: getApiUrl(),
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset.slice(1)
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        validatorUrl: null,
        tryItOutEnabled: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        onComplete: function() {
          console.log('Swagger UI loaded successfully');
        },
        onFailure: function(error) {
          console.error('Swagger UI failed to load:', error);
          document.getElementById('swagger-ui').innerHTML = 
            '<div style="padding: 20px; text-align: center;">' +
            '<h2>API 문서를 불러올 수 없습니다</h2>' +
            '<p>잠시 후 다시 시도해주세요.</p>' +
            '<p>문제가 지속되면 관리자에게 문의하세요.</p>' +
            '</div>';
        }
      });
    };
    </script>
  </body>
</html>
`;

  return new NextResponse(simpleSwaggerHTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block"
    },
  });
}
