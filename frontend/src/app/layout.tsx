import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalLayout from "@/components/pages/GlobalLayout/GlobalLayout";
import Providers from "./providers";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";
import { generateLocalizedMetadata } from "@/utils/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 다국어 지원 메타데이터 생성
 * - 사용자 언어에 따라 동적으로 메타데이터 생성
 * - 한국어, 영어, 일본어 지원
 * - SEO 최적화
 */
export async function generateMetadata(): Promise<Metadata> {
  // 클라이언트 사이드에서 사용자 언어 감지 후 메타데이터 생성
  return generateLocalizedMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        )}
        <Analytics />
        <Providers>
          <GlobalLayout>{children}</GlobalLayout>
        </Providers>
      </body>
    </html>
  );
}
