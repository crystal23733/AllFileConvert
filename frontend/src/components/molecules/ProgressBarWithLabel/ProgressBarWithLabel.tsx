"use client";

import ProgressBar from "@/components/atoms/ProgressBar/ProgressBar";
import ProgressBarProps from "@/components/common/ProgressBar.types";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const ProgressBarWithLabel: FC<ProgressBarProps> = ({ status }) => {
  const { t } = useTranslation();

  // 상태별 번역 키 매핑
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return t("conversion.status.pending");
      case "processing":
        return t("conversion.status.processing");
      case "completed":
        return t("conversion.status.completed");
      case "failed":
        return t("conversion.status.failed");
      default:
        return t("conversion.status.idle");
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <ProgressBar status={status} />
      <span
        className={`text-xs font-medium ${
          status === "completed"
            ? "text-green-600"
            : status === "failed"
              ? "text-red-600"
              : "text-gray-500"
        }`}
      >
        {getStatusLabel(status)}
      </span>
    </div>
  );
};

export default ProgressBarWithLabel;
