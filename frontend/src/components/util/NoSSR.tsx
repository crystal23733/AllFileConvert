"use client";

import { FC, ReactNode, useEffect, useState } from "react";

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * SSR(Server-Side Rendering)을 비활성화하는 컴포넌트
 *
 * 클라이언트에서만 렌더링되어야 하는 컴포넌트를 감쌀 때 사용합니다.
 * 주로 다국적화 텍스트나 localStorage 의존 컴포넌트에 사용됩니다.
 *
 * @param children - 클라이언트에서만 렌더링할 컴포넌트
 * @param fallback - 서버사이드에서 보여줄 대체 컴포넌트 (선택사항)
 */
const NoSSR: FC<NoSSRProps> = ({ children, fallback = null }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default NoSSR;
