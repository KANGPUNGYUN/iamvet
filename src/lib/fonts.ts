import localFont from "next/font/local";

// GmarketSans 공식 TTF 파일 사용
export const gmarketSans = localFont({
  src: [
    {
      path: "../app/fonts/title/GmarketSansLight.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../app/fonts/title/GmarketSansMedium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/title/GmarketSansBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-title",
  display: "swap",
});

// SUIT TTF 파일 사용 (woff2 decode 문제로 인해)
export const suit = localFont({
  src: [
    {
      path: "../app/fonts/text/SUIT-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../app/fonts/text/SUIT-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/text/SUIT-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/text/SUIT-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-text",
  display: "swap",
});
