"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const UnsupportedFormatsTab: React.FC = () => {
  const { t } = useTranslation();

  const unsupportedTypes = [
    t("formatInfo.unsupported.types.pdf"),
    t("formatInfo.unsupported.types.presentation"),
    t("formatInfo.unsupported.types.apple"),
    t("formatInfo.unsupported.types.archive"),
    t("formatInfo.unsupported.types.executable"),
    t("formatInfo.unsupported.types.system"),
    t("formatInfo.unsupported.types.encrypted"),
    t("formatInfo.unsupported.types.database"),
    t("formatInfo.unsupported.types.font"),
    t("formatInfo.unsupported.types.flash"),
  ];

  const warningItems = [
    t("formatInfo.unsupported.warnings.pdf"),
    t("formatInfo.unsupported.warnings.presentation"),
    t("formatInfo.unsupported.warnings.spreadsheetPdf"),
    t("formatInfo.unsupported.warnings.apple"),
    t("formatInfo.unsupported.warnings.archive"),
    t("formatInfo.unsupported.warnings.executable"),
    t("formatInfo.unsupported.warnings.encrypted"),
    t("formatInfo.unsupported.warnings.corrupted"),
    t("formatInfo.unsupported.warnings.size"),
  ];

  return (
    <div className="p-6 space-y-4">
      <p className="text-gray-600 mb-4">{t("formatInfo.unsupported.description")}</p>

      <div className="grid gap-3">
        {unsupportedTypes.map((type, index) => (
          <div key={index} className="bg-red-50 border border-red-200 rounded px-4 py-3">
            <span className="text-red-700">{type}</span>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-yellow-800 mb-2">
          {t("formatInfo.unsupported.warnings.title")}
        </h4>
        <ul className="text-yellow-700 space-y-1">
          {warningItems.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UnsupportedFormatsTab;
