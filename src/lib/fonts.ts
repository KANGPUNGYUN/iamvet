import localFont from 'next/font/local';

export const gmarketSans = localFont({
  src: [
    {
      path: '../app/fonts/title/GmarketSansLight.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../app/fonts/title/GmarketSansMedium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../app/fonts/title/GmarketSansBold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-title',
  display: 'swap',
});

export const suit = localFont({
  src: [
    {
      path: '../app/fonts/text/SUIT-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../app/fonts/text/SUIT-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
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
      path: '../app/fonts/text/SUIT-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../app/fonts/text/SUIT-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../app/fonts/text/SUIT-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../app/fonts/text/SUIT-Heavy.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-text',
  display: 'swap',
});
