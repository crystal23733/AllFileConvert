"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import FormatCategoryCard from "../FormatCategoryCard/FormatCategoryCard";
import {
  VIDEO_FORMATS,
  AUDIO_FORMATS,
  IMAGE_FORMATS,
  WRITER_FORMATS,
  SPREADSHEET_FORMATS,
} from "@/constants/convertFormats";

const SupportedFormatsTab: React.FC = () => {
  const { t } = useTranslation();

  const supportedCategories = [
    { name: t("formatInfo.supported.categories.video"), formats: VIDEO_FORMATS },
    { name: t("formatInfo.supported.categories.audio"), formats: AUDIO_FORMATS },
    { name: t("formatInfo.supported.categories.image"), formats: IMAGE_FORMATS },
    { name: t("formatInfo.supported.categories.document"), formats: WRITER_FORMATS },
    { name: t("formatInfo.supported.categories.spreadsheet"), formats: SPREADSHEET_FORMATS },
    // 📽️ 프레젠테이션: LibreOffice에서 지원하지 않음 (모든 변환 실패)
    // 📄 PDF: 변환 지원하지 않음 (LibreOffice export filter 없음)
    // 📦 압축: 백엔드에서 지원하지 않음
  ].filter(category => category.formats.length > 0); // 빈 포맷 카테고리 제외

  return (
    <div className="p-6 space-y-6">
      <p className="text-gray-600 mb-4">{t("formatInfo.supported.description")}</p>

      {supportedCategories.map(category => (
        <FormatCategoryCard key={category.name} name={category.name} formats={category.formats} />
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-blue-800 mb-2">{t("formatInfo.supported.examples.title")}</h4>
        <ul className="text-blue-700 space-y-1">
          <li>{t("formatInfo.supported.examples.video")}</li>
          <li>{t("formatInfo.supported.examples.document")}</li>
          <li>{t("formatInfo.supported.examples.spreadsheet")}</li>
          <li>{t("formatInfo.supported.examples.image")}</li>
          <li>{t("formatInfo.supported.examples.audio")}</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <h4 className="font-semibold text-yellow-800 mb-2">{t("formatInfo.supported.pdfWarning.title")}</h4>
        <p className="text-yellow-700" style={{ whiteSpace: 'pre-line' }}>
          {t("formatInfo.supported.pdfWarning.description")}
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <h4 className="font-semibold text-green-800 mb-2">{t("formatInfo.supported.koreanSupport.title")}</h4>
        <p className="text-green-700">
          {t("formatInfo.supported.koreanSupport.description")}
        </p>
      </div>
    </div>
  );
};

export default SupportedFormatsTab;
