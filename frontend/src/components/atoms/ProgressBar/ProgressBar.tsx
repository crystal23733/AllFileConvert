import { FC } from "react";
import ProgressBarProps from "./ProgressBar.types";
import getBarProps from "./style/getBarProps";

const ProgressBar: FC<ProgressBarProps> = ({ status }) => {
  const { value, color } = getBarProps(status);
  return (
    <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
      <div
        className={`h2 transition-all ${color}`}
        style={{ width: `${value}%` }}
        role="progressbar"
      ></div>
    </div>
  );
};

export default ProgressBar;
