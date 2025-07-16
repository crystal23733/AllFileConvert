import { FC } from "react";

/**
 * * 간단하고 재사용성이 높은 로딩 애니메이션 컴포넌트
 * @returns {JSX.Element}
 */
const Spinner: FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-6 w-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
