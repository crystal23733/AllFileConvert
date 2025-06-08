import Typography from "@/components/atoms/Typography/Typography";
import { FC } from "react";

const AppHeader: FC = () => (
  <header className="w-full py-4 px-4 bg-white shadow flex items-center justify-between sticky top-0 z-50">
    {/* 로고/사이트명 */}
    <div className="flex items-center gap-2">
      <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        A
      </span>
      <Typography variant="title" className="ml-2">
        AllFileConvert
      </Typography>
    </div>
    {/* 네비게이션/언어선택 등 (필요시) */}
    <nav>{/* 나중에 다국어, FAQ 등 추가 가능 */}</nav>
  </header>
);

export default AppHeader;
