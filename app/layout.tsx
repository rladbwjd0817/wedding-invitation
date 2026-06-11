import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Cormorant Garamond: next/font/google으로 자동 최적화 (self-hosted)
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: 'YUJEONG · JAEKEUN',
  description: '2027. 10. 23. SAT 오후 12시 | 울산시티컨벤션',
  openGraph: {
    title: 'YUJEONG · JAEKEUN',
    description: '2027. 10. 23. SAT 오후 12시 | 울산시티컨벤션',
    url: 'https://wedding-invitation-eight-dusky-18.vercel.app',
    images: [
      {
        url: 'https://wedding-invitation-eight-dusky-18.vercel.app/images/landing/landing.jpg',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${cormorant.variable} h-full antialiased`}>
      <head>
        {/* Pretendard: dynamic subset CDN — 사용된 글자만 로드해 용량 최소화 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard-dynamic-subset/dist/web/pretendard-dynamic-subset.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
