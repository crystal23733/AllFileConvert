import { FC } from "react";
import ButtonProps from "./Button.types";

const Button: FC<ButtonProps> = ({ children, variant = "secondary", ...rest }) => {
  return (
    <button
      className={
        variant === "primary"
          ? "py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 transition w-full"
          : "py-2 px-4 rounded bg-gray-200 text-black hover:bg-gray-300 transition w-full"
      }
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
