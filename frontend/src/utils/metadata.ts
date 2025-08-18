import type { Metadata } from "next";
import { headers } from "next/headers";

// 각 언어별 메타데이터를 직접 import
import koTranslations from "@/i18n/locales/ko.json";
import enTranslations from "@/i18n/locales/en.json";
import jaTranslations from "@/i18n/locales/ja.json";

/**
 * 언어별 메타데이터 생성 유틸리티
 * - 사용자의 언어 설정에 따라 적절한 메타데이터 반환
 * - SEO 최적화를 위한 다국어 지원
 * - OpenGraph, Twitter 카드 등 모든 메타데이터 포함
 */

interface MetadataTranslations {
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    imageAlt: string;
  };
  twitter: {
    title: string;
    description: string;
    imageAlt: string;
  };
}

// 언어별 번역 맵
const translationsMap = {
  ko: koTranslations.metadata,
  en: enTranslations.metadata,
  ja: jaTranslations.metadata,
} as const;

/**
 * 현재 언어에 맞는 메타데이터 번역 가져오기
 */
async function getMetadataTranslations(language?: string): Promise<MetadataTranslations> {
  // 언어가 지정되지 않은 경우 브라우저에서 감지 시도
  let currentLanguage = language || "ko";

  // SSR 환경에서 헤더 확인
  if (!language && typeof window === "undefined") {
    try {
      const headersList = await headers();
      const acceptLanguage = headersList.get("accept-language");
      if (acceptLanguage) {
        const browserLang = acceptLanguage.split(",")[0].split("-")[0];
        if (["ko", "en", "ja"].includes(browserLang)) {
          currentLanguage = browserLang;
        }
      }
    } catch (error) {
      console.error("Error getting metadata translations", error);
      currentLanguage = "ko";
    }
  }

  // 클라이언트 환경에서 localStorage 확인
  if (!language && typeof window !== "undefined") {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage && ["ko", "en", "ja"].includes(savedLanguage)) {
      currentLanguage = savedLanguage;
    } else {
      const browserLanguage = navigator.language.split("-")[0];
      if (["ko", "en", "ja"].includes(browserLanguage)) {
        currentLanguage = browserLanguage;
      }
    }
  }

  // 타입 가드
  const validLanguage = ["ko", "en", "ja"].includes(currentLanguage)
    ? (currentLanguage as keyof typeof translationsMap)
    : "ko";

  return translationsMap[validLanguage];
}

/**
 * 언어별 locale 코드 매핑
 */
function getLocaleCode(language: string): string {
  const localeMap: Record<string, string> = {
    ko: "ko_KR",
    en: "en_US",
    ja: "ja_JP",
  };

  return localeMap[language] || "ko_KR";
}

/**
 * 다국어 메타데이터 생성
 * @param pageTitle 페이지별 제목 (옵션)
 * @param language 강제 언어 설정 (옵션)
 * @returns 완전한 메타데이터 객체
 */
export async function generateLocalizedMetadata(
  pageTitle?: string,
  language?: string
): Promise<Metadata> {
  const translations = await getMetadataTranslations(language);
  const currentLanguage = language || detectUserLanguage();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost";

  return {
    title: {
      default: translations.title,
      template: translations.titleTemplate,
    },
    description: translations.description,
    keywords: translations.keywords,
    authors: [{ name: "FilpFile" }],
    creator: "FilpFile",
    publisher: "FilpFile",
    category: "technology",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
      languages: {
        ko: "/ko",
        en: "/en",
        ja: "/ja",
      },
    },
    openGraph: {
      title: translations.openGraph.title,
      description: translations.openGraph.description,
      url: baseUrl,
      siteName: "FilpFile",
      locale: getLocaleCode(currentLanguage),
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: translations.openGraph.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: translations.twitter.title,
      description: translations.twitter.description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: translations.twitter.imageAlt,
        },
      ],
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
}

/**
 * 특정 언어로 메타데이터 생성 (SSR/SSG용)
 * @param language 언어 코드 (ko, en, ja)
 * @param pageTitle 페이지별 제목 (옵션)
 * @returns 해당 언어의 메타데이터 객체
 */
export async function generateMetadataForLanguage(
  language: string,
  pageTitle?: string
): Promise<Metadata> {
  return await generateLocalizedMetadata(pageTitle, language);
}

/**
 * 브라우저에서 사용자 언어 감지
 * @returns 감지된 언어 코드 또는 기본값 "ko"
 */
export function detectUserLanguage(): string {
  if (typeof window === "undefined") {
    return "ko"; // SSR에서는 기본값 반환
  }

  // localStorage 확인
  const savedLanguage = localStorage.getItem("i18nextLng");
  if (savedLanguage && ["ko", "en", "ja"].includes(savedLanguage)) {
    return savedLanguage;
  }

  // 브라우저 언어 확인
  const browserLanguage = navigator.language.split("-")[0];
  if (["ko", "en", "ja"].includes(browserLanguage)) {
    return browserLanguage;
  }

  return "ko"; // 기본값
}
