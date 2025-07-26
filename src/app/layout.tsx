import { gmarketSans, suit } from "@/lib/fonts";
import "./globals.css";
import "./fonts.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${gmarketSans.variable} ${suit.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="preload"
          href="/fonts/title/GmarketSansLight.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/title/GmarketSansMedium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/title/GmarketSansBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/text/SUIT-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/text/SUIT-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/text/SUIT-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-text">{children}</body>
    </html>
  );
}
