"use client";

import { FC } from "react";
import AdAreaProps from "./AdArea.types";
import { baseStyle, positionStyle } from "./style/AdArea.style";

/**
 * ! 구글 애드센스 승인 후 수정 필요
 */
const AdArea: FC<AdAreaProps> = ({ position, className = "" }) => {
  return (
    <aside role="complementary" className={`${baseStyle} ${positionStyle[position]} ${className}`}>
      {/* 구글 애드센스 광고 코드 */}
      {/* <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXX"        // ← 본인 ID로 교체
        data-ad-slot="1234567890"           // ← 위치마다 고유 slot
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <Script id={`ads-init-${position}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script> */}
    </aside>
  );
};

export default AdArea;
