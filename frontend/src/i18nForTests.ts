import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "ko",
  fallbackLng: "ko",
  resources: {
    ko: { 
      translation: {
        "errors": {
          "boundary": {
            "title": "알 수 없는 오류가 발생했습니다.",
            "message": "페이지를 새로고침하거나 관리자에게 문의해주세요."
          },
          "notFound": {
            "title": "404 - 페이지를 찾을 수 없습니다",
            "description": "존재하지 않는 주소이거나, 페이지가 삭제되었을 수 있습니다.",
            "button": "홈으로 돌아가기"
          }
        },
        "preview": {
          "title": "변환 결과 미리보기",
          "unsupported": "미리보기를 지원하지 않는 파일 유형입니다.",
          "pdfTitle": "PDF 미리보기"
        },
        "header": {
          "title": "AllFileConvert",
          "languageSelect": "언어 선택"
        },
        "common": {
          "confirm": "확인"
        },
        "conversion": {
          "download": {
            "button": "파일 다운로드"
          }
        }
      }
    },
    en: { 
      translation: {
        "errors": {
          "boundary": {
            "title": "An unknown error occurred.",
            "message": "Please refresh the page or contact the administrator."
          },
          "notFound": {
            "title": "404 - Page Not Found",
            "description": "The page you are looking for does not exist or has been deleted.",
            "button": "Go Home"
          }
        },
        "preview": {
          "title": "Conversion Result Preview",
          "unsupported": "This file type does not support preview.",
          "pdfTitle": "PDF Preview"
        },
        "header": {
          "title": "AllFileConvert",
          "languageSelect": "Language Selection"
        },
        "common": {
          "confirm": "Confirm"
        },
        "conversion": {
          "download": {
            "button": "Download File"
          }
        }
      }
    },
    ja: { 
      translation: {
        "errors": {
          "boundary": {
            "title": "不明なエラーが発生しました。",
            "message": "ページを更新するか、管理者にお問い合わせください。"
          },
          "notFound": {
            "title": "404 - ページが見つかりません",
            "description": "お探しのページは存在しないか、削除された可能性があります。",
            "button": "ホームに戻る"
          }
        },
        "preview": {
          "title": "変換結果プレビュー",
          "unsupported": "このファイルタイプはプレビューをサポートしていません。",
          "pdfTitle": "PDFプレビュー"
        },
        "header": {
          "title": "AllFileConvert",
          "languageSelect": "言語選択"
        },
        "common": {
          "confirm": "確認"
        },
        "conversion": {
          "download": {
            "button": "ファイルをダウンロード"
          }
        }
      }
    },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
