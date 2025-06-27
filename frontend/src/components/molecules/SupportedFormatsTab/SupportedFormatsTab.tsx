"use client";

import React from "react";
import FormatCategoryCard from "../FormatCategoryCard/FormatCategoryCard";
import {
  VIDEO_FORMATS,
  AUDIO_FORMATS,
  IMAGE_FORMATS,
  DOCUMENT_FORMATS,
  ARCHIVE_FORMATS,
} from "@/constants/convertFormats";

const SupportedFormatsTab: React.FC = () => {
  const supportedCategories = [
    { name: "🎬 비디오", formats: VIDEO_FORMATS },
    { name: "🎵 오디오", formats: AUDIO_FORMATS },
    { name: "🖼️ 이미지", formats: IMAGE_FORMATS },
    { name: "📄 문서", formats: DOCUMENT_FORMATS },
    { name: "📦 압축", formats: ARCHIVE_FORMATS },
  ];

  return (
    <div className="p-6 space-y-6">
      <p className="text-gray-600 mb-4">다음 포맷들 간의 변환을 지원합니다.</p>

      {supportedCategories.map(category => (
        <FormatCategoryCard key={category.name} name={category.name} formats={category.formats} />
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-blue-800 mb-2">💡 변환 예시</h4>
        <ul className="text-blue-700 space-y-1">
          <li>• MP4 → AVI, MOV, WebM, MP3, WAV 등</li>
          <li>• PDF → DOCX, TXT, RTF 등</li>
          <li>• PNG → JPG, WebP, AVIF 등</li>
          <li>• MP3 → WAV, FLAC, AAC 등</li>
        </ul>
      </div>
    </div>
  );
};

export default SupportedFormatsTab;
