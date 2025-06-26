"use client";

import React from "react";

interface FormatInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FormatInfoModal: React.FC<FormatInfoModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[80vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">지원 포맷 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormatInfoModal; 