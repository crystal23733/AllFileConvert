import AdArea from "@/components/atoms/AdArea/AdArea";
import AppFooter from "@/components/organisms/AppFooter/AppFooter";
import AppHeader from "@/components/organisms/AppHeader/AppHeader";
import { FC, ReactNode } from "react";

interface GlobalLayoutProps {
  children: ReactNode;
}

const GlobalLayout: FC<GlobalLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      {/* 데스크탑: 양쪽 사이드 광고 */}
      <AdArea position="left" />
      <AdArea position="right" />
      {/* 상단 Header */}
      <AppHeader />
      {/* 최상단 광고 */}
      <AdArea position="top" />
      {/* 메인 콘텐츠 */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">{children}</main>
      {/* 하단 Footer & 광고 */}
      <AdArea position="bottom" />
      <AppFooter />
    </div>
  );
};

export default GlobalLayout;
