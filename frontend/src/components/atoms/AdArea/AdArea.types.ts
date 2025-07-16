import { ReactNode } from "react";

/**
 * 광고 영역 속성 정의
 * @property {string} position - 광고의 위치
 * @property {string} className - 클래스
 * @property {ReactNode} - 자식요소
 */
export default interface AdAreaProps {
  position: "top" | "bottom" | "right" | "left";
  className?: string;
  children?: ReactNode;
}
