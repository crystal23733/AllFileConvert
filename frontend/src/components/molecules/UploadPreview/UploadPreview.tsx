"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import UploadPreviewProps from "./UploadPreview.types";
import Typography from "@/components/atoms/Typography/Typography";
import formatSize from "@/util/formatSize";

const UploadPreview: FC<UploadPreviewProps> = ({ files, onRemove, className = "" }) => {
  const { t } = useTranslation();

  if (files.length === 0) return null;

  return (
    <div className={`rounded bg-gray-100 p-2 my-2 space-y-1 ${className}`}>
      {files.map((file, idx) => (
        <div
          key={file.name + idx}
          className="flex items-center justify-between gap-2 p-1 border-b last:border-0"
        >
          <div className="flex flex-col text-left flex-1">
            <Typography variant="body">{file.name}</Typography>
            <Typography variant="label" className="text-gray-400">
              {formatSize(file.size)} · {file.type}
            </Typography>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="text-red-400 hover:text-red-600 text-xs px-2"
              title={t("upload.preview.remove")}
            >
              {t("upload.preview.remove")}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UploadPreview;
