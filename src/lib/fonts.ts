import localFont from "next/font/local";

export const gmarketSans = localFont({
  src: [
    {
      path: "/fonts/title/GmarketSansLight.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "/fonts/title/GmarketSansMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "/fonts/title/GmarketSansBold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-title",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "sans-serif",
  ],
});

export const suit = localFont({
  src: [
    {
      path: "/fonts/text/SUIT-Thin.woff2", // ./ 제거하고 / 로 시작
      weight: "100",
      style: "normal",
    },
    {
      path: "/fonts/text/SUIT-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "/fonts/text/SUIT-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "/fonts/text/SUIT-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "/fonts/text/SUIT-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "/fonts/text/SUIT-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "/fonts/text/SUIT-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "/fonts/text/SUIT-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "/fonts/text/SUIT-Heavy.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-text",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "sans-serif",
  ],
});
