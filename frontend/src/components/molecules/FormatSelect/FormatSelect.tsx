import { FC } from "react";
import FormatSelectProps from "./FormatSelect.types";

const FormatSelect: FC<FormatSelectProps> = ({
  value,
  onChange,
  options,
  label = "변환 포맷 선택",
  disabled = false,
  className = "",
  id = "format-select",
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block mb-1 text-xs font-medium text-gray-600">
        {label}
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
