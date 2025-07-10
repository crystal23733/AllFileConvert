'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FeedbackModalProps } from './FeedbackModal.types';
import { FeedbackRequest, FeedbackType, FeedbackTypeOption } from '@/types/feedback';
import Button from '@/components/atoms/Button/Button';
import Typography from '@/components/atoms/Typography/Typography';

/**
 * 사용자 피드백 모달 컴포넌트
 */
const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  
  // 폼 상태 관리
  const [selectedType, setSelectedType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{
    message?: string;
  }>({});

  // 피드백 타입 옵션
  const feedbackTypes: FeedbackTypeOption[] = [
    { value: 'bug', label: t('feedback.types.bug'), icon: '🐛' },
    { value: 'feature', label: t('feedback.types.feature'), icon: '💡' },
    { value: 'improvement', label: t('feedback.types.improvement'), icon: '⚡' },
    { value: 'general', label: t('feedback.types.general'), icon: '💬' },
  ];

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // 폼 초기화
  const resetForm = () => {
    setMessage('');
    setSelectedType('general');
    setErrors({});
  };

  // 폼 유효성 검증
  const validateForm = (): boolean => {
    const newErrors: { message?: string } = {};

    // 메시지 검증
    if (!message.trim()) {
      newErrors.message = t('feedback.form.message.required');
    } else if (message.trim().length < 10) {
      newErrors.message = t('feedback.form.message.minLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // 익명 피드백으로 전송 (이메일은 빈 문자열)
    const feedbackData: FeedbackRequest = {
      email: "", // 완전 익명 피드백
      message: message.trim(),
      type: selectedType,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
    
    onSubmit(feedbackData);
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      {/* 모달 배경 클릭 시 닫기 */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-label="Close modal"
      />
      
      {/* 모달 컨테이너 */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Typography variant="title" className="text-lg font-semibold text-black">
              {t('feedback.title')}
            </Typography>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Typography variant="body" className="mt-2 text-black">
            {t('feedback.description')}
          </Typography>
          
          {/* 익명 피드백 안내 */}
          <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
            <Typography variant="body" className="text-blue-700 text-sm">
              {t('feedback.anonymous.notice')}
            </Typography>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {/* 피드백 타입 선택 */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {t('feedback.form.type.label')} *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {feedbackTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={`p-3 text-left rounded-md border transition-colors ${
                    selectedType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-black'
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{type.icon}</span>
                    <Typography variant="body" className="text-sm text-inherit">
                      {type.label}
                    </Typography>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 메시지 입력 */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              {t('feedback.form.message.label')} *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('feedback.form.message.placeholder')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
              disabled={isLoading}
            />
            {errors.message && (
              <Typography variant="body" className="text-red-500 text-sm mt-1">
                {errors.message}
              </Typography>
            )}
            <Typography variant="body" className="text-gray-500 text-xs mt-1">
              {t('feedback.anonymous.counter', { current: message.length, max: 1000 })}
            </Typography>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="primary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 text-black"
            >
              {t('feedback.actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1 text-black"
            >
              {isLoading ? t('feedback.actions.sending') : t('feedback.actions.send')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal; 