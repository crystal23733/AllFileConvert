"use client";

import React from "react";

interface FormatCategoryCardProps {
  name: string;
  formats: Array<{ value: string; label: string }>;
  className?: string;
}

const FormatCategoryCard: React.FC<FormatCategoryCardProps> = ({
  name,
  formats,
  className = "",
}) => {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{name}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {formats.map(format => (
          <div
            key={format.value}
            className="bg-green-50 border border-green-200 rounded px-3 py-2 text-center"
          >
            <span className="text-green-700 font-medium">{format.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormatCategoryCard;
