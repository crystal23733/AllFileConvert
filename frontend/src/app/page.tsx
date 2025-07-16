"use client";

import AlertModal from "@/components/atoms/AlertModal/AlertModal";
import UploadPreview from "@/components/molecules/UploadPreview/UploadPreview";
import SupportedFormats from "@/components/molecules/SupportedFormats/SupportedFormats";
import UnsupportedFileWarning from "@/components/molecules/UnsupportedFileWarning/UnsupportedFileWarning";
import StatusPanel from "@/components/organisms/StatusPanel/StatusPanel";
import UploadForm from "@/components/organisms/UploadForm/UploadForm";
import useFileConvertFlow from "@/hooks/home/useFileConvertFlow";
import FormatManager from "@/services/FormatManager";
import NoSSR from "@/components/util/NoSSR";
import { useState } from "react";

export default function Home() {
  const flow = useFileConvertFlow();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // 지원하지 않는 파일 확인
  const isUnsupportedFile = flow.files.length > 0 && !FormatManager.isSupported(flow.files[0].type);

  // 일반적인 비활성화 상태 (업로드/변환 중, 처리 중)
  const isProcessing =
    flow.uploadFile.isPending || flow.convertFile.isPending || flow.status === "processing";

  return (
    <div>
      {/* i18n이 사용되는 모든 컴포넌트를 NoSSR로 감싸서 hydration 오류 방지 */}
      <NoSSR
        fallback={
          <div className="space-y-4 max-w-lg mx-auto p-4 bg-white rounded shadow">
            <div className="w-full p-6 border-2 border-dashed rounded-xl text-center bg-gray-50 border-gray-200">
              <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
          </div>
        }
      >
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
          disabled={isProcessing || isUnsupportedFile} // 지원되지 않는 파일일 때도 변환 버튼 비활성화
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
          onRemove={() => {
            // 파일 제거 시 상태 초기화
            if (flow.files.length === 1) {
              flow.handleFileDrop([]);
            }
          }}
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
      </NoSSR>
    </div>
  );
}
