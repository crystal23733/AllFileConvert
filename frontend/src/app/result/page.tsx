"use client";

import ResultPreview from "@/components/molecules/ResultPreview/ResultPreview";
import StatusPanel from "@/components/organisms/StatusPanel/StatusPanel";
import { useState } from "react";

export default function ResultPage() {
  // 더미 데이터
  const [status] = useState<"completed">("completed");
  const [downloadUrl] = useState("/dummy/sample.mp4");
  const [fileType] = useState("video");
  const [fileName] = useState("sample.mp4");

  return (
    <div>
      <StatusPanel status={status} downloadUrl={downloadUrl} onDownload={() => {}} />
      <ResultPreview url={downloadUrl} type={fileType} filename={fileName} />
    </div>
  );
}
