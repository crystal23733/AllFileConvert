"use client";

import Typography from "@/components/atoms/Typography/Typography";
import Button from "@/components/atoms/Button/Button";
import FeedbackModal from "@/components/atoms/FeedbackModal/FeedbackModal";
import AlertModal from "@/components/atoms/AlertModal/AlertModal";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFeedback } from "@/hooks/feedback/useFeedback";
import { FeedbackRequest } from "@/types/feedback";

const AppFooter: FC = () => {
  const { t } = useTranslation();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    message: string;
    isSuccess: boolean;
  }>({
    isOpen: false,
    message: "",
    isSuccess: false,
  });

  const feedbackMutation = useFeedback();

  const handleFeedbackSubmit = async (feedback: FeedbackRequest) => {
    try {
      await feedbackMutation.mutateAsync(feedback);
      setIsFeedbackModalOpen(false);

      // 성공 알림 표시
      setAlertModal({
        isOpen: true,
        message: t("feedback.messages.success"),
        isSuccess: true,
      });

      console.log("✅ 피드백 전송 완료!");
    } catch (error: unknown) {
      console.error("❌ 피드백 전송 실패:", error);

      // 에러 메시지 처리
      let errorMessage = t("feedback.messages.error");

      if (error instanceof Error && error.message) {
        switch (error.message) {
          case "NETWORK_ERROR":
            errorMessage = t("feedback.messages.networkError");
            break;
          case "RATE_LIMIT_EXCEEDED":
            errorMessage = t("feedback.messages.rateLimitError");
            break;
          case "SERVER_ERROR":
            errorMessage = t("feedback.messages.serverError");
            break;
          case "TIMEOUT_ERROR":
            errorMessage = t("feedback.messages.timeoutError");
            break;
          case "BAD_REQUEST":
            errorMessage = t("feedback.messages.badRequestError");
            break;
          default:
            errorMessage = t("feedback.messages.error");
        }
      }

      // 에러 알림 표시
      setAlertModal({
        isOpen: true,
        message: errorMessage,
        isSuccess: false,
      });
    }
  };

  const handleAlertClose = () => {
    setAlertModal({
      isOpen: false,
      message: "",
      isSuccess: false,
    });
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
              {t("feedback.button")}
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

      {/* 결과 알림 모달 */}
      <AlertModal
        open={alertModal.isOpen}
        message={alertModal.message}
        onClose={handleAlertClose}
        confirmLabel={t("common.confirm")}
      />
    </>
  );
};

export default AppFooter;
