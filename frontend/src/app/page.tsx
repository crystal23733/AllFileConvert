"use client";

import AlertModal from "@/components/atoms/AlertModal/AlertModal";
import UploadPreview from "@/components/molecules/UploadPreview/UploadPreview";
import StatusPanel from "@/components/organisms/StatusPanel/StatusPanel";
import UploadForm from "@/components/organisms/UploadForm/UploadForm";
import useFileConvertFlow from "@/hooks/home/useFileConvertFlow";
import { useState } from "react";

export default function Home() {
  const flow = useFileConvertFlow();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

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
          flow.uploadFile.isPending || flow.convertFile.isPending || flow.status === "processing"
        }
        formatOptions={flow.formatOptions}
      />
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
      <AlertModal open={showAlert} message={alertMsg} onClose={() => setShowAlert(false)} />
    </div>
  );
}
