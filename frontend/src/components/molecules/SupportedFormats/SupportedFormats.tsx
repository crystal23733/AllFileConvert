"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FormatInfoModal from "@/components/atoms/FormatInfoModal/FormatInfoModal";
import SupportedFormatsTab from "../SupportedFormatsTab/SupportedFormatsTab";
import UnsupportedFormatsTab from "../UnsupportedFormatsTab/UnsupportedFormatsTab";

interface SupportedFormatsProps {
  className?: string;
}

const SupportedFormats: React.FC<SupportedFormatsProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"supported" | "unsupported">("supported");

  return (
    <>
      {/* 버튼으로 모달 열기 */}
      <div className={`text-center ${className}`}>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
        >
          {t("formatInfo.button")}
        </button>
      </div>

      {/* 모달 */}
      <FormatInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* 탭 버튼 */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab("supported")}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "supported"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("formatInfo.tabs.supported")}
          </button>
          <button
            onClick={() => setActiveTab("unsupported")}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "unsupported"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("formatInfo.tabs.unsupported")}
          </button>
        </div>

        {/* 탭 내용 */}
        {activeTab === "supported" ? <SupportedFormatsTab /> : <UnsupportedFormatsTab />}
      </FormatInfoModal>
    </>
  );
};

export default SupportedFormats;
