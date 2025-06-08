/**
 * 오류 페이지 타입
 * @property {() => void} onGoHome - 홈으로 돌아가는 함수
 */
export default interface NotFoundPageProps {
  onGoHome?: () => void;
}
