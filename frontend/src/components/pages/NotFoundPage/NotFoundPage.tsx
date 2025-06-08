import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/Typography/Typography";
import { FC } from "react";
import NotFoundPageProps from "./NotFoundPage.types";

const NotFoundPage: FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center">
      <Typography variant="title" className="mb-4">
        404 - 페이지를 찾을 수 없습니다
      </Typography>
      <Typography variant="body" className="mb-8 text-gray-500">
        존재하지 않는 주소이거나, 페이지가 삭제되었을 수 있습니다.
      </Typography>
      <Button onClick={onGoHome} variant="primary">
        홈으로 돌아가기
      </Button>
    </section>
  );
};

export default NotFoundPage;
