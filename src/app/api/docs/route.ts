// src/app/api/docs/route.ts
// Swagger UI를 위한 API route

import { NextRequest, NextResponse } from "next/server";

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
      // 현재 호스트와 포트를 동적으로 가져와서 사용
      const currentOrigin = window.location.origin;
      const ui = SwaggerUIBundle({
        url: currentOrigin + '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset.slice(1) // Remove the top bar plugin
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        validatorUrl: null
      });
    };
    </script>
  </body>
</html>
`;

export async function GET() {
  return new NextResponse(simpleSwaggerHTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
