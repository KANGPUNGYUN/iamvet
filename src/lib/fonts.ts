import localFont from 'next/font/local';

// GmarketSans 공식 TTF 파일 사용
export const gmarketSans = localFont({
  src: [
    {
      path: '../app/fonts/title/GmarketSansLight.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../app/fonts/title/GmarketSansMedium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../app/fonts/title/GmarketSansBold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-title',
  display: 'swap',
});

// SUIT는 새로 다운로드한 정상 파일 사용
export const suit = localFont({
  src: [
    {
      path: '../app/fonts/text/SUIT-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../app/fonts/text/SUIT-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../app/fonts/text/SUIT-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../app/fonts/text/SUIT-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-text',
  display: 'swap',
});
