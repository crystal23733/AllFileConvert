"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import ResultPreviewProps from "./ResultPreview.types";
import Typography from "@/components/atoms/Typography/Typography";
import Image from "next/image";

const ResultPreview: FC<ResultPreviewProps> = ({ url, type, filename, className = "" }) => {
  const { t } = useTranslation();

  if (!url) return null;
  return (
    <div className={`rounded bg-gray-100 p-4 flex flex-col items-center ${className}`}>
      <Typography variant="subtitle" className="mb-2">
        {t("preview.title")}
      </Typography>
      {type === "image" && (
        <Image
          src={url}
          alt={filename ?? "preview"}
          width={400} // 또는 원하는 고정/가변값
          height={300}
          className="max-w-full h-auto rounded shadow"
          style={{ objectFit: "contain" }}
        />
      )}
      {type === "video" && <video src={url} controls className="max-w-full rounded shadow" />}
      {type === "pdf" && (
        <iframe
          src={url}
          className="w-full h-72 rounded shadow"
          title={filename ?? t("preview.pdfTitle")}
        />
      )}
      {type !== "image" && type !== "video" && type !== "pdf" && (
        <Typography variant="label" className="text-gray-500">
          {t("preview.unsupported")}
        </Typography>
      )}
    </div>
  );
};

export default ResultPreview;
