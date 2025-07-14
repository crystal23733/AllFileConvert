"use client";

import Typography from "@/components/atoms/Typography/Typography";
import LanguageSwitcher from "@/components/molecules/LanguageSwitcher/LanguageSwitcher";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const AppHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <header className="w-full py-4 px-4 bg-white shadow flex items-center justify-between sticky top-0 z-50">
      {/* 로고/사이트명 */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center">
          <img src="/logo.png" alt="FlipFile" className="w-8 h-8" />
          <div className="w-8 h-8 bg-transparent"></div>
        </div>
        <Typography variant="title" className="ml-2">
          {t("header.title")}
        </Typography>
      </div>
      {/* 네비게이션/언어선택 등 (필요시) */}
      <nav className="flex items-center gap-4">
        <LanguageSwitcher />
        {/* 나중에 로그인, FAQ 등 추가 가능 */}
      </nav>
    </header>
  );
};

export default AppHeader;
