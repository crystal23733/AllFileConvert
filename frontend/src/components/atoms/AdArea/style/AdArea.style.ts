import AdAreaProps from "../AdArea.types";

/**
 * 기본 스타일 그룹
 */
export const baseStyle: string = "flex items-center justify-center";

/**
 * 위치에 따른 스타일 그룹
 */
export const positionStyle: Record<AdAreaProps["position"], string> = {
  top: "w-full min-h-[70px] mb-4",
  bottom: "w-full min-h-[60px] mt-4",
  left: "hidden lg:flex fixed top-0 left-0 h-screen w-[120px] z-40",
  right: "hidden lg:flex fixed top-0 right-0 h-screen w-[120px] z-40",
};
