import ProgressBar from "@/components/atoms/ProgressBar/ProgressBar";
import ProgressBarProps from "@/components/common/ProgressBar.types";
import { FC } from "react";
import statusLabel from "./constant/statusLabel";

const ProgressBarWithLabel: FC<ProgressBarProps> = ({ status }) => {
  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <ProgressBar status={status} />
      <span
        className={`text-xs font-medium ${
          status === "completed"
            ? "text-green-600"
            : status === "failed"
              ? "text-red-600"
              : "text-gray-500"
        }`}
      >
        {statusLabel[status]}
      </span>
    </div>
  );
};

export default ProgressBarWithLabel;
