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
      
      {/* 상단 Header - i18n 사용으로 인한 hydration 오류 방지 */}
      <NoSSR
        fallback={
          <header className="w-full py-4 bg-white shadow-sm border-b border-gray-200 mb-4">
            <div className="max-w-6xl mx-auto px-4">
              <nav className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-transparent"></div>
                  <div className="text-xl font-bold text-gray-900">FlipFile</div>
                </div>
                <div className="flex items-center space-x-2" style={{ minWidth: '160px', minHeight: '40px' }}>
                  <span className="text-sm font-medium text-gray-700">Language:</span>
                  <div className="relative">
                    <div className="p-2 pr-8 rounded border bg-white text-gray-700 text-sm w-20 h-8 animate-pulse bg-gray-100"></div>
                  </div>
                </div>
              </nav>
            </div>
          </header>
        }
      >
        <AppHeader />
      </NoSSR>
      
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
      
      {/* Footer - i18n 사용으로 인한 hydration 오류 방지 */}
      <NoSSR
        fallback={
          <footer className="w-full py-6 px-4 bg-gray-100 text-center mt-4 border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4">
                <div className="inline-block px-4 py-2 bg-gray-200 rounded animate-pulse h-8 w-20"></div>
              </div>
              <div className="text-gray-500 text-sm">© {new Date().getFullYear()} FlipFile. All rights reserved.</div>
            </div>
          </footer>
        }
      >
        <AppFooter />
      </NoSSR>
    </div>
  );
};

export default GlobalLayout;
