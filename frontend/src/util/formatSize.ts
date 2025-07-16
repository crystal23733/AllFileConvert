/**
 * 용량 문자열 포매팅 함수
 * @param {number} bytes - 파일의 용량
 * @returns {string} 자릿수에 따른 문자열 포매팅
 */
export default (bytes: number): string => {
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + " MB";
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(1) + " KB";
  return bytes + " B";
};
