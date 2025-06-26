"use client";

import React from "react";

interface UnsupportedFileWarningProps {
  fileName: string;
  mimeType: string;
  className?: string;
}

const UnsupportedFileWarning: React.FC<UnsupportedFileWarningProps> = ({
  fileName,
  mimeType,
  className = "",
}) => {
  const getFileTypeMessage = (mime: string) => {
    if (mime.includes("apple")) {
      return "Apple 전용 포맷 (Pages, Numbers, Keynote)";
    }
    if (mime === "application/zip") {
      return "ZIP 압축 파일";
    }
    if (mime.includes("executable") || mime.includes("msdownload")) {
      return "실행 파일";
    }
    return "지원하지 않는 파일 형식";
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1">
            지원하지 않는 파일 형식
          </h3>
          <p className="text-red-700 text-sm mb-2">
            <strong>{fileName}</strong>은(는) {getFileTypeMessage(mimeType)}으로 현재 변환을 지원하지 않습니다.
          </p>
          <div className="text-red-600 text-xs">
            <p>💡 대신 다음 형식의 파일을 사용해보세요:</p>
            <ul className="list-disc ml-4 mt-1">
              <li>문서: PDF, DOCX, PPTX, XLSX, TXT</li>
              <li>이미지: JPG, PNG, WebP, GIF, BMP</li>
              <li>비디오: MP4, AVI, MOV, WebM</li>
              <li>오디오: MP3, WAV, AAC, FLAC</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsupportedFileWarning; 