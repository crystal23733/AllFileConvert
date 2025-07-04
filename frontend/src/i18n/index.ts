import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 번역 리소스 import
import koTranslations from "./locales/ko.json";
import enTranslations from "./locales/en.json";
import jaTranslations from "./locales/ja.json";

/**
 * i18next 설정
 * - 언어 자동 감지 (브라우저 언어, localStorage 등)
 * - 번역 리소스 설정
 * - 폴백 언어 설정
 * - 보간법 설정
 * - SSR 호환성 개선
 */
const resources = {
  ko: {
    translation: koTranslations,
  },
  en: {
    translation: enTranslations,
  },
  ja: {
    translation: jaTranslations,
  },
};

i18n
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(initReactI18next) // React 통합
  .init({
    resources,
    fallbackLng: "ko", // 기본 언어는 한국어
    debug: false, // 디버그 로그 비활성화
    
    // 언어 감지 설정 - SSR 호환성 개선
    detection: {
      order: ["htmlTag", "localStorage", "navigator", "path", "subdomain"],
      caches: ["localStorage"],
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      // SSR에서는 localStorage 접근 불가하므로 htmlTag를 우선순위로
      excludeCacheFor: ["cimode"], // cimode는 캐시하지 않음
    },
    
    // 보간법 설정
    interpolation: {
      escapeValue: false, // React는 기본적으로 XSS 방지
    },
    
    // 네임스페이스 설정 (필요시 확장 가능)
    defaultNS: "translation",
    
    // 키가 없을 때 키 자체를 반환
    returnEmptyString: false,
    
    // 번역 키 형식 설정
    keySeparator: ".",
    nsSeparator: ":",
    
    // SSR 관련 설정
    lng: "ko", // 서버사이드에서 기본 언어 명시적 설정
    preload: ["ko", "en", "ja"], // 모든 언어 사전 로드
    
    // React 관련 설정
    react: {
      useSuspense: false, // SSR에서 Suspense 비활성화
    },
  });

export default i18n; 