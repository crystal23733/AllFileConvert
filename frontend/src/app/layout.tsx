import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalLayout from "@/components/pages/GlobalLayout/GlobalLayout";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 다국적화 지원 메타데이터
 * - 한국어, 영어, 일본어 지원
 * - SEO 최적화
 */
export const metadata: Metadata = {
  title: {
    default: "FlipFile - 무료 파일 변환 서비스",
    template: "%s | FlipFile",
  },
  description:
    "무료 온라인 파일 변환 서비스. 동영상, 이미지, 문서, 오디오 파일을 빠르고 안전하게 변환하세요. MP4, JPG, PDF, MP3 등 다양한 포맷 지원.",
  keywords: [
    "파일 변환",
    "온라인 변환",
    "무료 변환",
    "MP4",
    "JPG",
    "PDF",
    "MP3",
    "동영상 변환",
    "이미지 변환",
    "문서 변환",
  ],
  authors: [{ name: "FlipFile" }],
  creator: "FlipFile",
  publisher: "FlipFile",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://flipfile.com"), // 환경변수로 관리
  alternates: {
    canonical: "/",
    languages: {
      ko: "/ko",
      en: "/en",
      ja: "/ja",
    },
  },
  openGraph: {
    title: "FlipFile - 무료 파일 변환 서비스",
    description:
      "무료 온라인 파일 변환 서비스. 동영상, 이미지, 문서, 오디오 파일을 빠르고 안전하게 변환하세요.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://flipfile.com",
    siteName: "FlipFile",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlipFile - 무료 파일 변환 서비스",
    description:
      "무료 온라인 파일 변환 서비스. 동영상, 이미지, 문서, 오디오 파일을 빠르고 안전하게 변환하세요.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console 인증 코드 (실제 사용 시 추가)
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <GlobalLayout>{children}</GlobalLayout>
        </Providers>
      </body>
    </html>
  );
}
