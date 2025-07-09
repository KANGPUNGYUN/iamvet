import { gmarketSans, suit } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontBasePath = process.env.NEXT_PUBLIC_FONT_BASE_PATH || '/fonts';
  
  return (
    <html lang="ko" className={`${gmarketSans.variable} ${suit.variable}`}>
      <head>
        <link
          rel="preload"
          href={`${fontBasePath}/text/SUIT-Regular.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`${fontBasePath}/text/SUIT-Medium.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`${fontBasePath}/text/SUIT-SemiBold.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`${fontBasePath}/text/SUIT-Bold.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`${fontBasePath}/title/GmarketSansLight.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`${fontBasePath}/title/GmarketSansMedium.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`${fontBasePath}/title/GmarketSansBold.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={suit.className}>{children}</body>
    </html>
  );
}
