import { ReactNode } from "react";

/**
 * 텍스트 컴포넌트의 속성 정의
 * {variant} - 텍스트의 스타일 이름을 정의합니다.
 * {children} ReactNode - 텍스트에는 하위 요소가 있습니다.
 * {className} string - 클래스가 있을 수 있습니다.
 */
export default interface TypographyProps {
  variant?: "title" | "subtitle" | "body" | "label";
  children: ReactNode;
  className?: string;
}
