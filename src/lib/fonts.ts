import { Inter, Noto_Sans_KR } from 'next/font/google';

// 임시로 Google Fonts 사용하여 테스트
export const gmarketSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-title',
  display: 'swap',
});

export const suit = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-text',
  display: 'swap',
});
