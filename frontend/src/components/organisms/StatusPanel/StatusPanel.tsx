"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import StatusPanelProps from "./StatusPanel.types";
import Typography from "@/components/atoms/Typography/Typography";
import ProgressBarWithLabel from "@/components/molecules/ProgressBarWithLabel/ProgressBarWithLabel";
import Spinner from "@/components/atoms/Spinner/Spinner";
import Button from "@/components/atoms/Button/Button";

const StatusPanel: FC<StatusPanelProps> = ({
  status,
  downloadUrl,
  onDownload,
  isPolling = false,
  error,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <section
      className={`max-w-lg mx-auto p-4 bg-white rounded shadow space-y-4 mt-4 ${className}`}
      role="status"
    >
      {/* 상태에 따라 UI 분기 */}
      {status === "idle" && (
        <Typography variant="body" className="text-center">
          {t("conversion.status.idle")}
        </Typography>
      )}

      {(status === "pending" || status === "processing") && (
        <>
          <ProgressBarWithLabel status={status === "pending" ? "pending" : "processing"} />
          <div className="flex justify-center pt-2">
            <Spinner />
            {isPolling && (
              <span className="text-xs text-gray-400 animate-pulse">{t("conversion.progress.checking")}</span>
            )}
          </div>
          <Typography variant="label" className="text-blue-600 text-center">
            {t("conversion.progress.processing")}
          </Typography>
        </>
      )}

      {status === "completed" && downloadUrl && (
        <>
          <ProgressBarWithLabel status="completed" />
          <Typography variant="subtitle" className="text-center text-green-600">
            {t("conversion.progress.completed")}
          </Typography>
          <Button variant="primary" onClick={onDownload}>
            {t("conversion.download.button")}
          </Button>
        </>
      )}

      {status === "failed" && (
        <>
          <ProgressBarWithLabel status="failed" />
          <Typography variant="subtitle" className="text-center text-red-600">
            {t("conversion.progress.failed")}
          </Typography>
          {error && (
            <Typography variant="label" className="text-center text-red-400">
              {error}
            </Typography>
          )}
        </>
      )}
    </section>
  );
};

export default StatusPanel;
