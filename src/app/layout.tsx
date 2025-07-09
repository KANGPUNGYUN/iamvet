import { gmarketSans, suit } from "@/lib/fonts";
import "./globals.css";
import Head from "./head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${gmarketSans.variable} ${suit.variable}`}>
      <Head />
      <body className={suit.className} style={{ 
        fontFamily: "'SUIT', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif" 
      }}>
        {children}
      </body>
    </html>
  );
}
