import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalLayout from "@/components/pages/GlobalLayout/GlobalLayout";
import Providers from "./providers";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";

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
    default: "FilpFile - 무료 파일 변환 서비스",
    template: "%s | FilpFile",
  },
  description:
    "무료 온라인 파일 변환 서비스. 동영상, 이미지, 문서, 오디오 파일을 빠르고 안전하게 변환하세요. MP4, JPG, PDF, MP3 등 다양한 포맷 지원.",
  keywords: [
    // 한국어 키워드 (주요)
    "파일 변환",
    "온라인 변환",
    "무료 변환",
    "필파일",
    "filpfile",
    "동영상 변환",
    "이미지 변환",
    "문서 변환",
    "오디오 변환",
    // 파일 포맷 키워드
    "MP4",
    "AVI",
    "MOV",
    "WMV",
    "MKV",
    "FLV",
    "JPG",
    "PNG",
    "GIF",
    "WEBP",
    "BMP",
    "SVG",
    "PDF",
    "DOC",
    "DOCX",
    "XLS",
    "XLSX",
    "PPT",
    "PPTX",
    "MP3",
    "WAV",
    "AAC",
    "FLAC",
    "OGG",
    // 롱테일 키워드
    "동영상 포맷 변환",
    "이미지 포맷 변환",
    "pdf 변환기",
    "mp4 변환",
    "jpg 변환",
    "png 변환",
    "gif 변환",
    "무료 파일 컨버터",
    "온라인 컨버터",
    "파일 형식 변환",
    // 영어 키워드
    "file converter",
    "online converter",
    "free converter",
    "video converter",
    "image converter",
    "pdf converter",
  ],
  authors: [{ name: "FilpFile" }],
  creator: "FilpFile",
  publisher: "FilpFile",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost"), // 환경변수로 관리
  alternates: {
    canonical: "/",
    languages: {
      ko: "/ko",
      en: "/en",
      ja: "/ja",
    },
  },
  openGraph: {
    title: "FilpFile - 무료 파일 변환 서비스",
    description:
      "무료 온라인 파일 변환 서비스. 동영상, 이미지, 문서, 오디오 파일을 빠르고 안전하게 변환하세요.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost",
    siteName: "FilpFile",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "필파일(FilpFile) - 무료 파일 변환 서비스",
      },
    ],
    card: "summary_large_image",
    title: "FilpFile - 무료 파일 변환 서비스",
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
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
