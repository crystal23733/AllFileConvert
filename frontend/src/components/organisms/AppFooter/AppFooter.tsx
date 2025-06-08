import Typography from "@/components/atoms/Typography/Typography";
import { FC } from "react";

const AppFooter: FC = () => (
  <footer className="w-full py-4 px-4 bg-gray-100 text-center mt-12 border-t border-gray-200">
    <Typography variant="label" className="block text-gray-500">
      © {new Date().getFullYear()} AllFileConvert&nbsp;|&nbsp;모든 파일 변환 서비스
    </Typography>
    {/* 필요시 개인정보처리방침, 이용약관 등 링크 추가 */}
  </footer>
)

export default AppFooter;