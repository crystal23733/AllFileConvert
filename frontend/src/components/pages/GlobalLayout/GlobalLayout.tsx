import AdArea from "@/components/atoms/AdArea/AdArea";
import AppFooter from "@/components/organisms/AppFooter/AppFooter";
import AppHeader from "@/components/organisms/AppHeader/AppHeader";
import NoSSR from "@/components/util/NoSSR";
import { FC, ReactNode } from "react";

interface GlobalLayoutProps {
  children: ReactNode;
}

const GlobalLayout: FC<GlobalLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      {/* 데스크탑: 양쪽 사이드 광고 */}
      <NoSSR
        fallback={
          <aside
            role="complementary"
            className="fixed left-4 top-1/2 transform -translate-y-1/2 w-32 h-64 bg-gray-100 rounded shadow text-gray-500 flex items-center justify-center text-sm z-10"
          >
            [좌측 광고 영역]
          </aside>
        }
      >
        <AdArea position="left" />
      </NoSSR>
      <NoSSR
        fallback={
          <aside
            role="complementary"
            className="fixed right-4 top-1/2 transform -translate-y-1/2 w-32 h-64 bg-gray-100 rounded shadow text-gray-500 flex items-center justify-center text-sm z-10"
          >
            [우측 광고 영역]
          </aside>
        }
      >
        <AdArea position="right" />
      </NoSSR>
      {/* 상단 Header */}
      <AppHeader />
      {/* 최상단 광고 */}
      <NoSSR
        fallback={
          <aside
            role="complementary"
            className="w-full h-24 bg-gray-100 rounded shadow text-gray-500 flex items-center justify-center text-sm mb-4"
          >
            [상단 광고 영역]
          </aside>
        }
      >
        <AdArea position="top" />
      </NoSSR>
      {/* 메인 콘텐츠 */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">{children}</main>
      {/* 하단 Footer & 광고 */}
      <NoSSR
        fallback={
          <aside
            role="complementary"
            className="w-full h-24 bg-gray-100 rounded shadow text-gray-500 flex items-center justify-center text-sm mt-4"
          >
            [하단 광고 영역]
          </aside>
        }
      >
        <AdArea position="bottom" />
      </NoSSR>
      <AppFooter />
    </div>
  );
};

export default GlobalLayout;
