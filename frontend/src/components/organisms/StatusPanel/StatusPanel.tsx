import { FC } from "react";
import StatusPanelProps from "./StatusPanel.types";
import AdArea from "@/components/atoms/AdArea/AdArea";
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
  return (
    <section
      className={`max-w-lg mx-auto p-4 bg-white rounded shadow space-y-4 mt-4 ${className}`}
      role="status"
    >
      {/* 광고 영역 */}
      <AdArea position="top" />

      {/* 상태에 따라 UI 분기 */}
      {status === "idle" && (
        <Typography variant="body" className="text-center">
          파일을 업로드해 주세요.
        </Typography>
      )}

      {(status === "pending" || status === "processing") && (
        <>
          <ProgressBarWithLabel status={status === "pending" ? "pending" : "processing"} />
          <div className="flex justify-center pt-2">
            <Spinner />
            {isPolling && (
              <span className="text-xs text-gray-400 animate-pulse">상태 확인 중…</span>
            )}
          </div>
          <Typography variant="label" className="text-blue-600 text-center">
            변환이 진행 중입니다. 잠시만 기다려주세요.
          </Typography>
        </>
      )}

      {status === "completed" && downloadUrl && (
        <>
          <ProgressBarWithLabel status="completed" />
          <Typography variant="subtitle" className="text-center text-green-600">
            변환이 완료되었습니다!
          </Typography>
          <Button variant="primary" onClick={onDownload}>
            다운로드
          </Button>
        </>
      )}

      {status === "failed" && (
        <>
          <ProgressBarWithLabel status="failed" />
          <Typography variant="subtitle" className="text-center text-red-600">
            변환에 실패했습니다. 다시 시도해 주세요.
          </Typography>
          {error && (
            <Typography variant="label" className="text-center text-red-400">
              {error}
            </Typography>
          )}
        </>
      )}

      {/* 광고영역 */}
      <AdArea position="bottom" />
    </section>
  );
};

export default StatusPanel;
