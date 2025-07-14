import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "ko",
  fallbackLng: "ko",
  resources: {
    ko: {
      translation: {
        errors: {
          boundary: {
            title: "알 수 없는 오류가 발생했습니다.",
            message: "페이지를 새로고침하거나 관리자에게 문의해주세요.",
          },
          notFound: {
            title: "404 - 페이지를 찾을 수 없습니다",
            description: "존재하지 않는 주소이거나, 페이지가 삭제되었을 수 있습니다.",
            button: "홈으로 돌아가기",
          },
        },
        upload: {
          dropzone: {
            text: "파일을 끌어오거나 <1>클릭</1>해서 선택하세요",
            hint: "최대 100MB, mp4/pdf/jpg 등 지원",
            label: "파일 업로드",
          },
          format: {
            label: "변환 포맷 선택",
          },
          button: {
            convert: "변환 요청",
            converting: "업로드 중…",
          },
          preview: {
            remove: "삭제",
          },
        },
        fileTypes: {
          pdf: "PDF 파일 (입력 변환 지원 안함)",
          executable: "실행 파일",
          database: "데이터베이스 파일",
          font: "폰트 파일",
          certificate: "인증서 파일",
          flash: "Flash 파일",
          apple: "Apple 전용 포맷 (Pages, Numbers, Keynote)",
          archive: "압축 파일",
          unsupported: "지원하지 않는 파일 형식",
        },
        formatInfo: {
          title: "지원 포맷 정보",
          supported: {
            description: "다음 포맷들 간의 변환을 지원합니다.",
            categories: {
              video: "🎬 비디오",
              audio: "🎵 오디오",
              image: "🖼️ 이미지",
              document: "📝 텍스트 문서",
              spreadsheet: "📊 스프레드시트",
            },
            examples: {
              title: "💡 변환 예시",
              video: "• **비디오:** MP4 → AVI, MOV, WebM, MP3, WAV 등",
              document: "• **문서:** DOCX → PDF, DOC, ODT, RTF, TXT",
              spreadsheet: "• **스프레드시트:** XLSX → XLS, ODS, CSV, TXT (PDF 제외)",
              image: "• **이미지:** PNG → JPG, WebP, AVIF 등",
              audio: "• **오디오:** MP3 → WAV, FLAC, AAC 등",
            },
            pdfWarning: {
              title: "⚠️ PDF 변환 제한",
              description:
                "**PDF에서 다른 포맷으로의 변환은 지원하지 않습니다.**\nPDF는 다른 포맷으로 변환하기 위한 출력 대상으로만 사용할 수 있습니다. (예: DOCX → PDF, XLSX → PDF)",
            },
            koreanSupport: {
              title: "🎯 한글 지원",
              description:
                "모든 문서 변환에서 한글이 완벽하게 지원됩니다. PDF 변환 시에도 한글이 네모(□)로 표시되지 않고 정상적으로 보입니다.",
            },
          },
          unsupported: {
            description: "보안상의 이유로 다음 파일 형식은 지원하지 않습니다:",
            types: {
              pdf: "⚠️ PDF 파일 (.pdf) - 입력으로 사용 불가",
              presentation: "⚠️ 프레젠테이션 파일 (.ppt, .pptx, .odp) - LibreOffice 지원 없음",
              apple: "🚫 Apple 전용 포맷 (.pages, .numbers, .keynote)",
              archive: "🚫 압축 파일 (.zip, .rar, .7z)",
              executable: "🚫 실행 파일 (.exe, .app, .deb)",
              system: "🚫 시스템 파일 (.dll, .so, .dylib)",
              encrypted: "🚫 암호화된 파일 (.p7c, .cer)",
              database: "🚫 데이터베이스 파일 (.sqlite, .mdb)",
              font: "🚫 폰트 파일 (.ttf, .woff)",
              flash: "🚫 플래시 파일 (.swf)",
            },
            warnings: {
              title: "⚠️ 주의사항",
              pdf: "• **PDF:** 다른 포맷에서 PDF로 변환은 가능하지만, PDF에서 다른 포맷으로는 변환할 수 없습니다",
              presentation:
                "• **프레젠테이션:** PPT, PPTX, ODP 파일은 LibreOffice에서 변환을 지원하지 않습니다",
              spreadsheetPdf:
                "• **스프레드시트 PDF:** Excel 파일에서 PDF로의 변환은 현재 지원하지 않습니다",
              apple: "• Apple 포맷은 호환성 문제로 현재 지원하지 않습니다",
              archive: "• 압축 파일은 내용 확인이 어려워 지원하지 않습니다",
              executable: "• 실행 파일은 보안상 업로드가 차단됩니다",
              encrypted: "• 암호화된 파일은 변환할 수 없습니다",
              corrupted: "• 손상된 파일은 변환이 실패할 수 있습니다",
              size: "• 파일 크기는 최대 100MB까지 지원합니다",
            },
          },
        },
        preview: {
          title: "변환 결과 미리보기",
          unsupported: "미리보기를 지원하지 않는 파일 유형입니다.",
          pdfTitle: "PDF 미리보기",
        },
        header: {
          title: "FlipFile",
          languageSelect: "언어 선택",
        },
        common: {
          confirm: "확인",
          close: "닫기",
        },
        conversion: {
          status: {
            idle: "파일을 업로드해 주세요.",
            pending: "업로드 중",
            processing: "변환 중",
            completed: "변환 완료",
            failed: "변환 실패",
          },
          progress: {
            uploading: "파일 업로드 중...",
            converting: "파일 변환 중...",
            completed: "변환이 완료되었습니다!",
            failed: "변환에 실패했습니다. 다시 시도해 주세요.",
            processing: "변환이 진행 중입니다. 잠시만 기다려주세요.",
            checking: "상태 확인 중…",
          },
          download: {
            button: "파일 다운로드",
            completed: "다운로드 완료",
            error: "다운로드 중 오류가 발생했습니다.",
          },
        },
        warnings: {
          unsupportedFile: {
            title: "지원하지 않는 파일 형식",
            description: "**{{fileName}}**은(는) {{fileType}}으로 현재 변환을 지원하지 않습니다.",
            pdfGuide: {
              title: "📄 **PDF 변환 안내:**",
              output: "• PDF는 변환의 **출력 대상**으로만 사용할 수 있습니다",
              examples: "• 다른 문서를 PDF로 변환: DOCX → PDF, XLSX → PDF, PPTX → PDF",
              limitation: "• PDF에서 다른 포맷으로는 기술적 제약으로 변환할 수 없습니다",
            },
            alternatives: {
              title: "💡 대신 다음 형식의 파일을 사용해보세요:",
              document: "• 문서: DOCX, PPTX, XLSX, TXT (PDF로 변환 가능)",
              image: "• 이미지: JPG, PNG, WebP, GIF, BMP",
              video: "• 비디오: MP4, AVI, MOV, WebM",
              audio: "• 오디오: MP3, WAV, AAC, FLAC",
            },
          },
        },
      },
    },
    en: {
      translation: {
        errors: {
          boundary: {
            title: "An unknown error occurred.",
            message: "Please refresh the page or contact the administrator.",
          },
          notFound: {
            title: "404 - Page Not Found",
            description: "The page you are looking for does not exist or has been deleted.",
            button: "Go Home",
          },
        },
        upload: {
          dropzone: {
            text: "Drag and drop or <1>click</1> to select files",
            hint: "Max 100MB, supports mp4/pdf/jpg etc",
            label: "File Upload",
          },
          format: {
            label: "Select conversion format",
          },
          button: {
            convert: "Convert",
            converting: "Uploading…",
          },
          preview: {
            remove: "Remove",
          },
        },
        fileTypes: {
          pdf: "PDF file (input conversion not supported)",
          executable: "Executable file",
          database: "Database file",
          font: "Font file",
          certificate: "Certificate file",
          flash: "Flash file",
          apple: "Apple proprietary format (Pages, Numbers, Keynote)",
          archive: "Archive file",
          unsupported: "Unsupported file format",
        },
        formatInfo: {
          title: "Supported Format Information",
          supported: {
            description: "The following format conversions are supported.",
            categories: {
              video: "🎬 Video",
              audio: "🎵 Audio",
              image: "🖼️ Image",
              document: "📝 Documents",
              spreadsheet: "📊 Spreadsheets",
            },
            examples: {
              title: "💡 Conversion Examples",
              video: "• **Video:** MP4 → AVI, MOV, WebM, MP3, WAV etc",
              document: "• **Documents:** DOCX → PDF, DOC, ODT, RTF, TXT",
              spreadsheet: "• **Spreadsheets:** XLSX → XLS, ODS, CSV, TXT (excluding PDF)",
              image: "• **Images:** PNG → JPG, WebP, AVIF etc",
              audio: "• **Audio:** MP3 → WAV, FLAC, AAC etc",
            },
            pdfWarning: {
              title: "⚠️ PDF Conversion Limitations",
              description:
                "**Conversion from PDF to other formats is not supported.**\nPDF can only be used as an output target for conversion. (e.g. DOCX → PDF, XLSX → PDF)",
            },
            koreanSupport: {
              title: "🎯 Korean Support",
              description:
                "Korean text is fully supported in all document conversions. Korean characters will display correctly in PDF conversions without appearing as squares (□).",
            },
          },
          unsupported: {
            description: "The following file formats are not supported for security reasons:",
            types: {
              pdf: "⚠️ PDF files (.pdf) - Cannot be used as input",
              presentation: "⚠️ Presentation files (.ppt, .pptx, .odp) - LibreOffice not supported",
              apple: "🚫 Apple proprietary formats (.pages, .numbers, .keynote)",
              archive: "🚫 Archive files (.zip, .rar, .7z)",
              executable: "🚫 Executable files (.exe, .app, .deb)",
              system: "🚫 System files (.dll, .so, .dylib)",
              encrypted: "🚫 Encrypted files (.p7c, .cer)",
              database: "🚫 Database files (.sqlite, .mdb)",
              font: "🚫 Font files (.ttf, .woff)",
              flash: "🚫 Flash files (.swf)",
            },
            warnings: {
              title: "⚠️ Important Notes",
              pdf: "• **PDF:** Conversion to PDF is possible, but conversion from PDF to other formats is not supported",
              presentation:
                "• **Presentations:** PPT, PPTX, ODP files are not supported by LibreOffice conversion",
              spreadsheetPdf:
                "• **Spreadsheet PDF:** Excel to PDF conversion is currently not supported",
              apple: "• Apple formats are not currently supported due to compatibility issues",
              archive: "• Archive files are not supported due to content verification difficulties",
              executable: "• Executable files are blocked for security reasons",
              encrypted: "• Encrypted files cannot be converted",
              corrupted: "• Corrupted files may fail during conversion",
              size: "• File size limit is 100MB maximum",
            },
          },
        },
        preview: {
          title: "Conversion Result Preview",
          unsupported: "This file type does not support preview.",
          pdfTitle: "PDF Preview",
        },
        header: {
          title: "FlipFile",
          languageSelect: "Language Selection",
        },
        common: {
          confirm: "Confirm",
          close: "Close",
        },
        conversion: {
          status: {
            idle: "Please upload a file.",
            pending: "Uploading",
            processing: "Converting",
            completed: "Conversion completed",
            failed: "Conversion failed",
          },
          progress: {
            uploading: "Uploading file...",
            converting: "Converting file...",
            completed: "Conversion completed successfully!",
            failed: "Conversion failed. Please try again.",
            processing: "Conversion is in progress. Please wait.",
            checking: "Checking status...",
          },
          download: {
            button: "Download File",
            completed: "Download completed",
            error: "An error occurred while downloading.",
          },
        },
        warnings: {
          unsupportedFile: {
            title: "Unsupported file format",
            description:
              "**{{fileName}}** is {{fileType}} and is currently not supported for conversion.",
            pdfGuide: {
              title: "📄 **PDF Conversion Guide:**",
              output: "• PDF can only be used as **output target** for conversion",
              examples: "• Convert other documents to PDF: DOCX → PDF, XLSX → PDF, PPTX → PDF",
              limitation:
                "• PDF to other formats conversion is not possible due to technical limitations",
            },
            alternatives: {
              title: "💡 Please try using these file formats instead:",
              document: "• Documents: DOCX, PPTX, XLSX, TXT (convertible to PDF)",
              image: "• Images: JPG, PNG, WebP, GIF, BMP",
              video: "• Videos: MP4, AVI, MOV, WebM",
              audio: "• Audio: MP3, WAV, AAC, FLAC",
            },
          },
        },
      },
    },
    ja: {
      translation: {
        errors: {
          boundary: {
            title: "不明なエラーが発生しました。",
            message: "ページを更新するか、管理者にお問い合わせください。",
          },
          notFound: {
            title: "404 - ページが見つかりません",
            description: "お探しのページは存在しないか、削除された可能性があります。",
            button: "ホームに戻る",
          },
        },
        upload: {
          dropzone: {
            text: "ファイルをドラッグ&ドロップまたは<1>クリック</1>で選択",
            hint: "最大100MB、mp4/pdf/jpgなどをサポート",
            label: "ファイルアップロード",
          },
          format: {
            label: "変換フォーマットを選択",
          },
          button: {
            convert: "変換リクエスト",
            converting: "アップロード中…",
          },
          preview: {
            remove: "削除",
          },
        },
        fileTypes: {
          pdf: "PDFファイル (入力変換サポートなし)",
          executable: "実行ファイル",
          database: "データベースファイル",
          font: "フォントファイル",
          certificate: "証明書ファイル",
          flash: "Flashファイル",
          apple: "Apple専用フォーマット (Pages, Numbers, Keynote)",
          archive: "圧縮ファイル",
          unsupported: "サポートされていないファイル形式",
        },
        formatInfo: {
          title: "サポートフォーマット情報",
          supported: {
            description: "以下のフォーマット間の変換をサポートしています。",
            categories: {
              video: "🎬 ビデオ",
              audio: "🎵 オーディオ",
              image: "🖼️ 画像",
              document: "📝 文書",
              spreadsheet: "📊 スプレッドシート",
            },
            examples: {
              title: "💡 変換例",
              video: "• **ビデオ:** MP4 → AVI, MOV, WebM, MP3, WAV など",
              document: "• **文書:** DOCX → PDF, DOC, ODT, RTF, TXT",
              spreadsheet: "• **スプレッドシート:** XLSX → XLS, ODS, CSV, TXT (PDF除く)",
              image: "• **画像:** PNG → JPG, WebP, AVIF など",
              audio: "• **オーディオ:** MP3 → WAV, FLAC, AAC など",
            },
            pdfWarning: {
              title: "⚠️ PDF変換制限",
              description:
                "**PDFから他のフォーマットへの変換はサポートされていません。**\nPDFは変換の出力対象としてのみ使用できます。(例: DOCX → PDF, XLSX → PDF)",
            },
            koreanSupport: {
              title: "🎯 韓国語サポート",
              description:
                "すべての文書変換で韓国語が完全にサポートされています。PDF変換時も韓国語が四角(□)で表示されることなく正常に表示されます。",
            },
          },
          unsupported: {
            description: "セキュリティ上の理由により、以下のファイル形式はサポートされていません:",
            types: {
              pdf: "⚠️ PDFファイル (.pdf) - 入力として使用不可",
              presentation:
                "⚠️ プレゼンテーションファイル (.ppt, .pptx, .odp) - LibreOfficeサポートなし",
              apple: "🚫 Apple専用フォーマット (.pages, .numbers, .keynote)",
              archive: "🚫 圧縮ファイル (.zip, .rar, .7z)",
              executable: "🚫 実行ファイル (.exe, .app, .deb)",
              system: "🚫 システムファイル (.dll, .so, .dylib)",
              encrypted: "🚫 暗号化ファイル (.p7c, .cer)",
              database: "🚫 データベースファイル (.sqlite, .mdb)",
              font: "🚫 フォントファイル (.ttf, .woff)",
              flash: "🚫 Flashファイル (.swf)",
            },
            warnings: {
              title: "⚠️ 注意事項",
              pdf: "• **PDF:** 他のフォーマットからPDFへの変換は可能ですが、PDFから他のフォーマットへは変換できません",
              presentation:
                "• **プレゼンテーション:** PPT, PPTX, ODPファイルはLibreOfficeで変換がサポートされていません",
              spreadsheetPdf:
                "• **スプレッドシートPDF:** ExcelファイルからPDFへの変換は現在サポートされていません",
              apple: "• Appleフォーマットは互換性の問題により現在サポートされていません",
              archive: "• 圧縮ファイルは内容の確認が困難なためサポートされていません",
              executable: "• 実行ファイルはセキュリティ上の理由でブロックされます",
              encrypted: "• 暗号化されたファイルは変換できません",
              corrupted: "• 破損したファイルは変換に失敗する可能性があります",
              size: "• ファイルサイズは最大100MBまでサポートされます",
            },
          },
        },
        preview: {
          title: "変換結果プレビュー",
          unsupported: "このファイルタイプはプレビューをサポートしていません。",
          pdfTitle: "PDFプレビュー",
        },
        header: {
          title: "FlipFile",
          languageSelect: "言語選択",
        },
        common: {
          confirm: "確認",
          close: "閉じる",
        },
        conversion: {
          status: {
            idle: "ファイルをアップロードしてください。",
            pending: "アップロード中",
            processing: "変換中",
            completed: "変換完了",
            failed: "変換失敗",
          },
          progress: {
            uploading: "ファイルをアップロード中...",
            converting: "ファイルを変換中...",
            completed: "変換が完了しました！",
            failed: "変換に失敗しました。再試行してください。",
            processing: "変換を実行中です。しばらくお待ちください。",
            checking: "ステータス確認中...",
          },
          download: {
            button: "ファイルをダウンロード",
            completed: "ダウンロード完了",
            error: "ダウンロード中にエラーが発生しました。",
          },
        },
        warnings: {
          unsupportedFile: {
            title: "サポートされていないファイル形式",
            description: "**{{fileName}}**は{{fileType}}で、現在変換がサポートされていません。",
            pdfGuide: {
              title: "📄 **PDF変換ガイド:**",
              output: "• PDFは変換の**出力対象**としてのみ使用できます",
              examples: "• 他の文書をPDFに変換: DOCX → PDF, XLSX → PDF, PPTX → PDF",
              limitation: "• PDFから他のフォーマットへの変換は技術的制約により不可能です",
            },
            alternatives: {
              title: "💡 代わりに以下のファイル形式をお試しください:",
              document: "• 文書: DOCX, PPTX, XLSX, TXT (PDF変換可能)",
              image: "• 画像: JPG, PNG, WebP, GIF, BMP",
              video: "• ビデオ: MP4, AVI, MOV, WebM",
              audio: "• オーディオ: MP3, WAV, AAC, FLAC",
            },
          },
        },
      },
    },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
