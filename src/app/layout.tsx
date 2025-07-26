import { gmarketSans, suit } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${gmarketSans.variable} ${suit.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: `              
              html, body {
                font-family: 'SUIT', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "맑은 고딕", sans-serif;
              }
              
              /* 인라인 스타일 오버라이드 제거 - 문제 원인 */
              /* [style*="fontFamily"], [style*="font-family"] 선택자 제거 */
              
              /* 인라인 스타일 오버라이드 제거 완료 */
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
