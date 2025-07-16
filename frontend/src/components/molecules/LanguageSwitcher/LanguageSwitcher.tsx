"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import languages from "./constant/languages";

/**
 * 언어 전환 컴포넌트
 * - 한국어, 영어, 일본어 지원
 * - localStorage에 선택한 언어 저장
 * - 브라우저 언어 자동 감지
 */
const LanguageSwitcher: FC = () => {
  const { i18n, t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
    // localStorage 저장과 html lang 속성 업데이트는 i18n에서 자동 처리됨
  };

  // 현재 언어에 해당하는 언어 정보 찾기
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="flex items-center space-x-2">
      {/* Language 텍스트 라벨 */}
      <span className="text-sm font-medium text-gray-700">Language:</span>

      <div className="relative">
        <select
          value={i18n.language}
          onChange={handleChange}
          className="p-2 pr-8 rounded border bg-white text-gray-700 text-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-colors cursor-pointer appearance-none"
          aria-label={t("header.languageSelect")}
          title={t("header.languageSelect")}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>

        {/* 커스텀 드롭다운 화살표 */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* 현재 선택된 언어 표시 (모바일에서 유용) */}
        <span className="sr-only">
          {t("header.languageSelect")}: {currentLanguage.label}
        </span>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
