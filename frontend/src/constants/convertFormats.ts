/**
 * 비디오 변환 선택 포맷
 * @constant
 */
export const VIDEO_FORMATS = [
  { value: "mp4", label: "MP4" },
  { value: "avi", label: "AVI" },
  { value: "mov", label: "MOV" },
  { value: "webm", label: "WEBM" },
  { value: "mkv", label: "MKV" },
  { value: "wmv", label: "WMV" },
  { value: "flv", label: "FLV" },
  { value: "m4v", label: "M4V" },
];

/**
 * 오디오 변환 포맷
 * @constant
 */
export const AUDIO_FORMATS = [
  { value: "mp3", label: "MP3" },
  { value: "wav", label: "WAV" },
  { value: "aac", label: "AAC" },
  { value: "flac", label: "FLAC" },
  { value: "ogg", label: "OGG" },
  { value: "m4a", label: "M4A" },
];

/**
 * 이미지 변환 포맷
 * @constant
 */
export const IMAGE_FORMATS = [
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WEBP" },
  { value: "bmp", label: "BMP" },
  { value: "gif", label: "GIF" },
  { value: "svg", label: "SVG" },
  { value: "tiff", label: "TIFF" },
  { value: "ico", label: "ICO" },
  { value: "avif", label: "AVIF" },
];

/**
 * Writer 문서 포맷 (텍스트 기반)
 */
export const WRITER_FORMATS = [
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "DOCX" },
  { value: "doc", label: "DOC" },
  { value: "odt", label: "ODT (OpenDocument Text)" },
  { value: "rtf", label: "RTF" },
  { value: "txt", label: "TXT" },
];

/**
 * Calc 스프레드시트 포맷
 */
export const SPREADSHEET_FORMATS = [
  { value: "xlsx", label: "XLSX" },
  { value: "xls", label: "XLS" },
  { value: "ods", label: "ODS (OpenDocument Spreadsheet)" },
  { value: "csv", label: "CSV" },
  { value: "txt", label: "TXT" },
]; // PDF 제외 - LibreOffice에서 실패

/**
 * Impress 프레젠테이션 포맷
 */
export const PRESENTATION_FORMATS: Array<{ value: string; label: string }> = [
  // LibreOffice에서 프레젠테이션 변환 지원하지 않음 (모든 변환 실패)
];

/**
 * PDF 변환 포맷 (제한적)
 */
export const PDF_FORMATS = [
  { value: "txt", label: "TXT" }, // PDF는 텍스트 추출만 가능
];

/**
 * 모든 문서 포맷 (레거시 호환성용)
 */
export const DOCUMENT_FORMATS = [
  ...WRITER_FORMATS,
  ...SPREADSHEET_FORMATS.filter(f => !WRITER_FORMATS.find(w => w.value === f.value)),
  ...PRESENTATION_FORMATS.filter(
    f =>
      !WRITER_FORMATS.find(w => w.value === f.value) &&
      !SPREADSHEET_FORMATS.find(s => s.value === f.value)
  ),
];

/**
 * 압축 포맷 (현재 백엔드에서 지원하지 않음)
 */
export const ARCHIVE_FORMATS: Array<{ value: string; label: string }> = [
  // 백엔드 지원 없음 - 비활성화
];

/**
 * 지원하는 입력 포맷 (MIME Type별)
 */
export const SUPPORTED_INPUT_FORMATS = {
  // 이미지 - 백엔드 ImageMagickTransformer 지원 포맷
  "image/jpeg": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/png": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/webp": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/bmp": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/gif": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/svg+xml": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/tiff": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/vnd.microsoft.icon": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"], // ICO 파일
  "image/x-icon": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"], // ICO 대체 MIME
  "image/avif": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"], // AVIF

  // 비디오 - 백엔드 FFmpegTransformer 지원 포맷
  "video/mp4": ["mp4", "avi", "mov", "webm", "mkv", "wmv", "flv", "m4v", "mp3", "wav", "aac"],
  "video/avi": ["mp4", "avi", "mov", "webm", "mkv", "wmv", "flv", "m4v", "mp3", "wav", "aac"],
  "video/x-msvideo": ["mp4", "avi", "mov", "webm", "mkv", "wmv", "flv", "m4v", "mp3", "wav", "aac"], // AVI 표준 MIME
  "video/quicktime": ["mp4", "avi", "mov", "webm", "mkv", "wmv", "flv", "m4v", "mp3", "wav", "aac"], // MOV
  "video/webm": ["mp4", "avi", "mov", "webm", "mkv", "wmv", "flv", "m4v", "mp3", "wav", "aac"],
  "video/x-matroska": [
    "mp4",
    "avi",
    "mov",
    "webm",
    "mkv",
    "wmv",
    "flv",
    "m4v",
    "mp3",
    "wav",
    "aac",
  ], // MKV
  "video/x-ms-wmv": ["mp4", "avi", "mov", "webm", "mkv", "wmv", "flv", "m4v", "mp3", "wav", "aac"], // WMV
  "video/x-flv": ["mp4", "avi", "mov", "webm", "mkv", "wmv", "flv", "m4v", "mp3", "wav", "aac"], // FLV
  "video/x-m4v": ["mp4", "avi", "mov", "webm", "mkv", "wmv", "flv", "m4v", "mp3", "wav", "aac"], // M4V

  // 오디오 - 백엔드 FFmpegTransformer 지원 포맷 (정규화된 MIME 타입 포함)
  "audio/mpeg": ["mp3", "wav", "aac", "flac", "ogg", "m4a"], // MP3
  "audio/wav": ["mp3", "wav", "aac", "flac", "ogg", "m4a"], // 정규화된 WAV
  "audio/x-wav": ["mp3", "wav", "aac", "flac", "ogg", "m4a"], // 원본 WAV MIME
  "audio/aac": ["mp3", "wav", "aac", "flac", "ogg", "m4a"],
  "audio/flac": ["mp3", "wav", "aac", "flac", "ogg", "m4a"], // 정규화된 FLAC
  "audio/x-flac": ["mp3", "wav", "aac", "flac", "ogg", "m4a"], // 원본 FLAC MIME
  "audio/ogg": ["mp3", "wav", "aac", "flac", "ogg", "m4a"],
  "audio/mp4": ["mp3", "wav", "aac", "flac", "ogg", "m4a"], // M4A
  "audio/m4a": ["mp3", "wav", "aac", "flac", "ogg", "m4a"], // 정규화된 M4A
  "audio/x-m4a": ["mp3", "wav", "aac", "flac", "ogg", "m4a"], // 원본 M4A MIME

  // 문서 - 백엔드 LibreOfficeTransformer 지원 포맷 (실제 지원되는 변환만)
  // Writer 문서들 (텍스트 기반)
  "application/msword": ["pdf", "docx", "odt", "rtf", "txt"], // DOC
  "application/x-ole-storage": ["pdf", "docx", "odt", "rtf", "txt"], // 구버전 DOC 파일
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    "pdf",
    "doc",
    "odt",
    "rtf",
    "txt",
  ], // DOCX
  "application/vnd.oasis.opendocument.text": ["pdf", "docx", "doc", "rtf", "txt"], // ODT
  "text/plain": ["pdf", "docx", "doc", "odt", "rtf"], // TXT
  "text/rtf": ["pdf", "docx", "doc", "odt", "txt"], // 정규화된 RTF
  "application/rtf": ["pdf", "docx", "doc", "odt", "txt"], // 원본 RTF MIME

  // Calc 스프레드시트들 (PDF 변환 제외 - LibreOffice에서 실패)
  "application/vnd.ms-excel": ["xlsx", "ods", "csv", "txt"], // XLS
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    "xls",
    "ods",
    "csv",
    "txt",
  ], // XLSX
  "application/vnd.oasis.opendocument.spreadsheet": ["xlsx", "xls", "csv", "txt"], // ODS
  "text/csv": ["xlsx", "xls", "ods"], // CSV

  // Impress 프레젠테이션들 - LibreOffice에서 지원하지 않음 (모든 변환 실패)
  // "application/vnd.ms-powerpoint": [], // PPT
  // "application/vnd.openxmlformats-officedocument.presentationml.presentation": [], // PPTX
  // "application/vnd.oasis.opendocument.presentation": [], // ODP
};

/**
 * 지원하지 않는 포맷들 (표시용)
 */
export const UNSUPPORTED_FORMATS = [
  // 실행 파일
  "application/x-executable",
  "application/x-msdos-program",
  "application/x-msdownload",

  // 시스템 파일
  "application/x-sharedlib",
  "application/x-object",

  // 암호화된 파일
  "application/x-pkcs7-certificates",
  "application/x-x509-ca-cert",

  // 데이터베이스 파일
  "application/x-sqlite3",
  "application/vnd.ms-access",

  // 특수 포맷
  "application/x-font-ttf",
  "application/x-font-woff",
  "application/vnd.adobe.flash.movie",
];

/**
 * 포맷별 카테고리 매핑
 */
export const FORMAT_CATEGORIES = {
  image: IMAGE_FORMATS,
  video: VIDEO_FORMATS,
  audio: AUDIO_FORMATS,
  document: DOCUMENT_FORMATS,
  writer: WRITER_FORMATS,
  spreadsheet: SPREADSHEET_FORMATS,
  presentation: PRESENTATION_FORMATS,
  pdf: PDF_FORMATS,
};

/**
 * MIME 타입으로 카테고리 결정
 */
export const getFormatCategory = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("application/") || mimeType.startsWith("text/")) return "document";
  return "document"; // archive 제거, 기본값은 document
};

/**
 * 지원하는 변환 포맷 목록 가져오기 (MIME 타입별 정확한 매칭)
 */
export const getSupportedFormats = (mimeType: string): Array<{ value: string; label: string }> => {
  const supportedExtensions =
    SUPPORTED_INPUT_FORMATS[mimeType as keyof typeof SUPPORTED_INPUT_FORMATS] || [];

  // MIME 타입별로 적절한 포맷 풀 선택
  let formatPool: Array<{ value: string; label: string }> = [];

  if (mimeType.startsWith("image/")) {
    formatPool = IMAGE_FORMATS;
  } else if (mimeType.startsWith("video/")) {
    formatPool = VIDEO_FORMATS;
  } else if (mimeType.startsWith("audio/")) {
    formatPool = AUDIO_FORMATS;
  } else {
    // 문서 타입별 세분화
    switch (mimeType) {
      // Writer 문서들
      case "application/msword":
      case "application/x-ole-storage": // 구버전 DOC 파일
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/vnd.oasis.opendocument.text":
      case "text/plain":
      case "text/rtf":
      case "application/rtf":
        formatPool = WRITER_FORMATS;
        break;

      // Calc 스프레드시트들
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/vnd.oasis.opendocument.spreadsheet":
      case "text/csv":
        formatPool = SPREADSHEET_FORMATS;
        break;

              // Impress 프레젠테이션들 - LibreOffice에서 지원하지 않음
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      case "application/vnd.oasis.opendocument.presentation":
        formatPool = []; // 빈 배열로 지원하지 않음을 표시
        break;

      // PDF는 변환 지원하지 않음 (LibreOffice export filter 없음)
      case "application/pdf":
        formatPool = []; // 빈 배열로 지원하지 않음을 표시
        break;

      default:
        formatPool = DOCUMENT_FORMATS; // 폴백
    }
  }

  return formatPool.filter((format: { value: string; label: string }) =>
    supportedExtensions.includes(format.value)
  );
};
