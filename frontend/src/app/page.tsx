"use client";

import AlertModal from "@/components/atoms/AlertModal/AlertModal";
import UploadPreview from "@/components/molecules/UploadPreview/UploadPreview";
import SupportedFormats from "@/components/molecules/SupportedFormats/SupportedFormats";
import UnsupportedFileWarning from "@/components/molecules/UnsupportedFileWarning/UnsupportedFileWarning";
import StatusPanel from "@/components/organisms/StatusPanel/StatusPanel";
import UploadForm from "@/components/organisms/UploadForm/UploadForm";
import useFileConvertFlow from "@/hooks/home/useFileConvertFlow";
import FormatManager from "@/services/FormatManager";
import { useState } from "react";

export default function Home() {
  const flow = useFileConvertFlow();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // 지원하지 않는 파일 확인
  const isUnsupportedFile = flow.files.length > 0 && !FormatManager.isSupported(flow.files[0].type);

  return (
    <div>
      <UploadForm
        onFileDrop={flow.handleFileDrop}
        selectedFormat={flow.format}
        onFormatChange={flow.setFormat}
        onSubmit={() =>
          flow.handleSubmit(undefined, msg => {
            setAlertMsg(msg);
            setShowAlert(true);
          })
        }
        isSubmitting={flow.uploadFile.isPending || flow.convertFile.isPending}
        disabled={
          flow.uploadFile.isPending ||
          flow.convertFile.isPending ||
          flow.status === "processing" ||
          isUnsupportedFile
        }
        formatOptions={flow.formatOptions}
      />

      {/* 지원하지 않는 파일 경고 */}
      {isUnsupportedFile && (
        <UnsupportedFileWarning
          fileName={flow.files[0].name}
          mimeType={flow.files[0].type}
          className="mt-4"
        />
      )}

      <UploadPreview
        files={flow.files.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
        }))}
      />
      <StatusPanel
        status={flow.status}
        downloadUrl={flow.downloadUrl}
        onDownload={() =>
          flow.handleDownload(msg => {
            setAlertMsg(msg);
            setShowAlert(true);
          })
        }
      />

      {/* 지원 포맷 정보 섹션 */}
      <div className="mt-12">
        <SupportedFormats />
      </div>

      <AlertModal open={showAlert} message={alertMsg} onClose={() => setShowAlert(false)} />
    </div>
  );
}
