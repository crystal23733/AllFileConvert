"use client";

import { FC } from "react";
import { useTranslation, Trans } from "react-i18next";
import DropzoneProps from "./Dropzone.types";
import { useDropzone } from "react-dropzone";

const Dropzone: FC<DropzoneProps> = ({
  onDrop,
  disabled = false,
  accept,
  multiple = false,
  className = "",
}) => {
  const { t } = useTranslation();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      data-testid="dropzone-root"
      className={
        `w-full p-6 border-2 border-dashed rounded-xl text-center transition
        cursor-pointer outline-none select-none 
        ${isDragActive ? "bg-blue-50 border-blue-400" : "bg-gray-50 border-gray-200"}
        ${disabled ? "opacity-50 pointer-events-none" : ""}
        ` + className
      }
      tabIndex={-1}
    >
      <input {...getInputProps()} aria-label={t("upload.dropzone.label")} data-testid="dropzone-input" />
      <p className="text-gray-500 text-base">
        <Trans 
          i18nKey="upload.dropzone.text"
          components={{
            1: <span className="text-blue-600 underline" />
          }}
        />
      </p>
      <p className="text-xs text-gray-400 mt-1">{t("upload.dropzone.hint")}</p>
    </div>
  );
};

export default Dropzone;
