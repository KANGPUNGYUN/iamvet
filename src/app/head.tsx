import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '아이엠벳',
  description: '아이엠벳 서비스',
}

export default function Head() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'SUIT';
              src: url('/fonts/text/SUIT-Regular.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'SUIT';
              src: url('/fonts/text/SUIT-Medium.woff2') format('woff2');
              font-weight: 500;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'SUIT';
              src: url('/fonts/text/SUIT-SemiBold.woff2') format('woff2');
              font-weight: 600;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'SUIT';
              src: url('/fonts/text/SUIT-Bold.woff2') format('woff2');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Gmarket Sans';
              src: url('/fonts/title/GmarketSansLight.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Gmarket Sans';
              src: url('/fonts/title/GmarketSansMedium.woff2') format('woff2');
              font-weight: 500;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Gmarket Sans';
              src: url('/fonts/title/GmarketSansBold.woff2') format('woff2');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
            
            /* 폰트 로딩 강제 적용 */
            body {
              font-family: 'SUIT', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "맑은 고딕", sans-serif !important;
            }
          `,
        }}
      />
    </>
  )
}