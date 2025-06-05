import { ButtonHTMLAttributes, ReactNode } from "react";

export default interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant: "primary" | "secondary";
}
