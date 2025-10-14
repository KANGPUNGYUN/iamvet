import { gmarketSans, suit } from "@/lib/fonts";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { QueryProvider } from "@/components/providers/QueryProvider";
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
        <meta
          name="google-site-verification"
          content="td2rnXEEwjO-IAgJVIJmSwbbGRgFl4fpl2Zst_rEvFQ"
        />
        <meta
          name="google-site-verification"
          content="td2rnXEEwjO-IAgJVIJmSwbbGRgFl4fpl2Zst_rEvFQ"
        />
      </head>
      <body className="font-text">
        <QueryProvider>
          <ClientLayout>{children}</ClientLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
