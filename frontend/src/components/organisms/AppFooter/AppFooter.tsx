"use client";

import Typography from "@/components/atoms/Typography/Typography";
import Button from "@/components/atoms/Button/Button";
import FeedbackModal from "@/components/atoms/FeedbackModal/FeedbackModal";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFeedback } from "@/hooks/feedback/useFeedback";
import { FeedbackRequest } from "@/types/feedback";

const AppFooter: FC = () => {
  const { t } = useTranslation();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const feedbackMutation = useFeedback();

  const handleFeedbackSubmit = async (feedback: FeedbackRequest) => {
    try {
      await feedbackMutation.mutateAsync(feedback);
      setIsFeedbackModalOpen(false);
      
      // 성공 메시지는 별도 알림 시스템이 있을 때 표시
      // 현재는 콘솔에 로그 출력
      console.log('✅ 피드백 전송 완료!');
    } catch (error) {
      // 에러는 FeedbackModal 내에서 처리
      console.error('❌ 피드백 전송 실패:', error);
    }
  };

  return (
    <>
      <footer className="w-full py-6 px-4 bg-gray-100 text-center mt-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* 피드백 버튼 */}
          <div className="mb-4">
            <Button
              variant="secondary"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="text-sm px-4 py-2 text-black"
            >
              {t('feedback.button')}
            </Button>
          </div>

          {/* 저작권 정보 */}
          <Typography variant="label" className="block text-gray-500">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </Typography>
          
          {/* 추후 필요시 개인정보처리방침, 이용약관 등 링크 추가 */}
        </div>
      </footer>

      {/* 피드백 모달 */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        isLoading={feedbackMutation.isPending}
      />
    </>
  );
};

export default AppFooter;
