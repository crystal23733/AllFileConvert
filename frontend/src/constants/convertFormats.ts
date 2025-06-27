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
  { value: "3gp", label: "3GP" },
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
  { value: "heic", label: "HEIC" },
  { value: "avif", label: "AVIF" },
];

/**
 * 문서 변환 포맷
 */
export const DOCUMENT_FORMATS = [
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "DOCX" },
  { value: "doc", label: "DOC" },
  { value: "pptx", label: "PPTX" },
  { value: "ppt", label: "PPT" },
  { value: "xlsx", label: "XLSX" },
  { value: "xls", label: "XLS" },
  { value: "txt", label: "TXT" },
  { value: "rtf", label: "RTF" },
  { value: "csv", label: "CSV" },
  { value: "odt", label: "ODT (OpenDocument Text)" },
  { value: "ods", label: "ODS (OpenDocument Spreadsheet)" },
  { value: "odp", label: "ODP (OpenDocument Presentation)" },
];

/**
 * 압축 포맷
 */
export const ARCHIVE_FORMATS = [
  { value: "zip", label: "ZIP" },
  { value: "7z", label: "7Z" },
  { value: "tar", label: "TAR" },
  { value: "tar.gz", label: "TAR.GZ" },
  { value: "rar", label: "RAR" },
];

/**
 * 지원하는 입력 포맷 (MIME Type별)
 */
export const SUPPORTED_INPUT_FORMATS = {
  // 이미지
  "image/jpeg": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/png": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/webp": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/bmp": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/gif": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/svg+xml": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/tiff": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],
  "image/heic": ["jpg", "png", "webp", "bmp", "gif", "tiff", "ico", "avif"],

  // 비디오
  "video/mp4": [
    "mp4",
    "avi",
    "mov",
    "webm",
    "mkv",
    "wmv",
    "flv",
    "m4v",
    "3gp",
    "mp3",
    "wav",
    "aac",
  ],
  "video/avi": [
    "mp4",
    "avi",
    "mov",
    "webm",
    "mkv",
    "wmv",
    "flv",
    "m4v",
    "3gp",
    "mp3",
    "wav",
    "aac",
  ],
  "video/quicktime": [
    "mp4",
    "avi",
    "mov",
    "webm",
    "mkv",
    "wmv",
    "flv",
    "m4v",
    "3gp",
    "mp3",
    "wav",
    "aac",
  ],
  "video/webm": [
    "mp4",
    "avi",
    "mov",
    "webm",
    "mkv",
    "wmv",
    "flv",
    "m4v",
    "3gp",
    "mp3",
    "wav",
    "aac",
  ],
  "video/x-msvideo": [
    "mp4",
    "avi",
    "mov",
    "webm",
    "mkv",
    "wmv",
    "flv",
    "m4v",
    "3gp",
    "mp3",
    "wav",
    "aac",
  ],

  // 오디오
  "audio/mpeg": ["mp3", "wav", "aac", "flac", "ogg", "m4a"],
  "audio/wav": ["mp3", "wav", "aac", "flac", "ogg", "m4a"],
  "audio/aac": ["mp3", "wav", "aac", "flac", "ogg", "m4a"],
  "audio/flac": ["mp3", "wav", "aac", "flac", "ogg", "m4a"],
  "audio/ogg": ["mp3", "wav", "aac", "flac", "ogg", "m4a"],
  "audio/mp4": ["mp3", "wav", "aac", "flac", "ogg", "m4a"],

  // 문서
  "application/pdf": ["docx", "doc", "txt", "rtf", "odt"],
  "application/msword": ["pdf", "docx", "txt", "rtf", "odt"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    "pdf",
    "doc",
    "txt",
    "rtf",
    "odt",
  ],
  "application/vnd.ms-powerpoint": ["pdf", "pptx", "odp"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    "pdf",
    "ppt",
    "odp",
  ],
  "application/vnd.ms-excel": ["pdf", "xlsx", "csv", "ods"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["pdf", "xls", "csv", "ods"],
  "application/vnd.oasis.opendocument.text": ["pdf", "docx", "doc", "txt", "rtf"],
  "application/vnd.oasis.opendocument.spreadsheet": ["pdf", "xlsx", "xls", "csv"],
  "application/vnd.oasis.opendocument.presentation": ["pdf", "pptx", "ppt"],
  "text/plain": ["pdf", "docx", "doc", "rtf", "odt"],
  "text/rtf": ["pdf", "docx", "doc", "txt", "odt"],
  "text/csv": ["pdf", "xlsx", "xls", "ods"],
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
  archive: ARCHIVE_FORMATS,
};

/**
 * MIME 타입으로 카테고리 결정
 */
export const getFormatCategory = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("application/") || mimeType.startsWith("text/")) return "document";
  return "unknown";
};

/**
 * 지원하는 변환 포맷 목록 가져오기
 */
export const getSupportedFormats = (mimeType: string): Array<{ value: string; label: string }> => {
  const supportedExtensions =
    SUPPORTED_INPUT_FORMATS[mimeType as keyof typeof SUPPORTED_INPUT_FORMATS] || [];
  const category = getFormatCategory(mimeType);
  const allFormats = FORMAT_CATEGORIES[category as keyof typeof FORMAT_CATEGORIES] || [];

  return allFormats.filter((format: { value: string; label: string }) =>
    supportedExtensions.includes(format.value)
  );
};
