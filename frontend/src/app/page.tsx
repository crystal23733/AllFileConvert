"use client";

import UploadPreview from "@/components/molecules/UploadPreview/UploadPreview";
import StatusPanel from "@/components/organisms/StatusPanel/StatusPanel";
import UploadForm from "@/components/organisms/UploadForm/UploadForm";
import { useState } from "react";

export default function Home() {
  // 더미 상태
  const [files, setFiles] = useState([{ name: "sample.mp4", size: 12345678, type: "video/mp4" }]);
  const [format, setFormat] = useState("mp4");
  const [status, setStatus] = useState<"idle" | "pending" | "processing" | "completed" | "failed">(
    "idle"
  );

  return (
    <div>
      <UploadForm
        onFileDrop={dropped =>
          setFiles(dropped.map(f => ({ name: f.name, size: f.size, type: f.type })))
        }
        selectedFormat={format}
        onFormatChange={setFormat}
        onSubmit={() => setStatus("pending")}
        isSubmitting={status === "pending"}
        disabled={status === "pending"}
        formatOptions={[
          { value: "mp4", label: "MP4(동영상)" },
          { value: "pdf", label: "PDF(문서)" },
          { value: "jpg", label: "JPG(이미지)" },
        ]}
      />
      <UploadPreview files={files} />
      <StatusPanel status={status} />
    </div>
  );
}
