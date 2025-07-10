"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";
import FormatSelectProps from "./FormatSelect.types";

const FormatSelect: FC<FormatSelectProps> = ({
  value,
  onChange,
  options,
  label,
  disabled = false,
  className = "",
  id = "format-select",
}) => {
  const { t } = useTranslation();

  // label이 제공되지 않으면 기본 번역 사용
  const displayLabel = label || t("upload.format.label");

  return (
    <div className={className}>
      <label htmlFor={id} className="block mb-1 text-xs font-medium text-gray-600">
        {displayLabel}
      </label>
      <select
        id={id}
        className="w-full p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormatSelect;
