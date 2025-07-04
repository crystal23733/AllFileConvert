"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { UNSUPPORTED_FORMATS } from "@/constants/convertFormats";

interface UnsupportedFileWarningProps {
  fileName: string;
  mimeType: string;
  className?: string;
}

const UnsupportedFileWarning: React.FC<UnsupportedFileWarningProps> = ({
  fileName,
  mimeType,
  className = "",
}) => {
  const { t } = useTranslation();

  const getFileTypeMessage = (mime: string) => {
    // PDF 특별 케이스
    if (mime === "application/pdf") {
      return t("fileTypes.pdf");
    }

    // 동적으로 UNSUPPORTED_FORMATS 체크
    if (UNSUPPORTED_FORMATS.includes(mime)) {
      if (mime.includes("executable") || mime.includes("msdownload")) {
        return t("fileTypes.executable");
      }
      if (mime.includes("sqlite") || mime.includes("access")) {
        return t("fileTypes.database");
      }
      if (mime.includes("font")) {
        return t("fileTypes.font");
      }
      if (mime.includes("pkcs") || mime.includes("cert")) {
        return t("fileTypes.certificate");
      }
      if (mime.includes("flash")) {
        return t("fileTypes.flash");
      }
    }

    // 일반적인 카테고리별 메시지
    if (mime.startsWith("application/") && mime.includes("apple")) {
      return t("fileTypes.apple");
    }
    if (mime === "application/zip" || mime.includes("compress") || mime.includes("archive")) {
      return t("fileTypes.archive");
    }

    return t("fileTypes.unsupported");
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1">{t("warnings.unsupportedFile.title")}</h3>
          <p className="text-red-700 text-sm mb-2">
            {t("warnings.unsupportedFile.description", { 
              fileName, 
              fileType: getFileTypeMessage(mimeType) 
            })}
          </p>
          {mimeType === "application/pdf" ? (
            <div className="text-red-600 text-xs">
              <p>{t("warnings.unsupportedFile.pdfGuide.title")}</p>
              <ul className="list-disc ml-4 mt-1">
                <li>{t("warnings.unsupportedFile.pdfGuide.output")}</li>
                <li>{t("warnings.unsupportedFile.pdfGuide.examples")}</li>
                <li>{t("warnings.unsupportedFile.pdfGuide.limitation")}</li>
              </ul>
            </div>
          ) : (
            <div className="text-red-600 text-xs">
              <p>{t("warnings.unsupportedFile.alternatives.title")}</p>
              <ul className="list-disc ml-4 mt-1">
                <li>{t("warnings.unsupportedFile.alternatives.document")}</li>
                <li>{t("warnings.unsupportedFile.alternatives.image")}</li>
                <li>{t("warnings.unsupportedFile.alternatives.video")}</li>
                <li>{t("warnings.unsupportedFile.alternatives.audio")}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnsupportedFileWarning;
