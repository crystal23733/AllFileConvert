"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import languages from "./constant/languages";

const LanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleChange}
      className="p-2 rounded border bg-white text-gray-700 text-sm"
      aria-label="언어 선택"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
