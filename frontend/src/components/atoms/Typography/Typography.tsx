import { FC } from "react";
import TypographyProps from "./Typography.types";
import baseStyle from "./style/baseStyle";

/**
 * 텍스트를 상황에 따라 스타일을 정의해 사용합니다.
 */
const Typography: FC<TypographyProps> = ({variant = 'body', children, className = ''}) => {
  return (
    <span className={`${baseStyle[variant]} ${className}`}>{children}</span>
  );
}

export default Typography;