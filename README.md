# 📁 AllFileConvert

AllFileConvert는 다양한 포맷의 영상, 문서, 이미지 파일을 웹에서 빠르게 변환할 수 있는 글로벌 타겟 서비스입니다.  
설치 없이 간단한 UI로 변환하고, 광고 기반으로 운영되며 MVP는 회원가입 없이 작동합니다.

---

## 🚀 주요 기능

- 🎞️ 동영상 변환 (`.mov` → `.mp4` 등)
- 📄 문서 변환 (`.docx` → `.pdf` 등)
- 🖼 이미지 변환 (`.png` → `.jpg` 등)
- 🌍 다국어 지원 (en, ko, ja)
- 💸 광고 기반 무료 사용

---

## 🧱 기술 스택

### 프론트엔드

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router, React Query
- i18next (다국어)
- Axios
- React Helmet Async (SEO)

### 백엔드

- Go (Gin)
- PostgreSQL (pgx)
- MIME 검사, 변환용 CLI (ffmpeg, libreoffice, imagemagick)
- Docker, Docker Compose
- Nginx (API Gateway + Static Proxy)

---

## 🏗 디렉토리 구조

```

allfileconvert/
├── frontend/
│   ├── src/
│   ├── index.html
│   └── ...
├── backend/
│   ├── upload/
│   ├── convert/
│   ├── download/
│   └── ...
├── nginx/
├── db/
└── docker-compose.yml

````

---

## 📦 실행 방법

### 1. 설치

```bash
git clone https://github.com/yourname/allfileconvert.git
cd allfileconvert
````

### 2. 프론트엔드 실행

```bash
cd frontend
yarn
yarn dev
```

### 3. 백엔드 실행 (Docker)

```bash
docker-compose up --build
```

---

## ✅ 개발 순서 (MVP 기준)

1. **Upload Service**

   * 파일 업로드 API, MIME 검증, Storage 저장
2. **Convert Service**

   * ffmpeg 등 연동, 변환 로직 구현
3. **Download Service**

   * 변환 파일 반환 + 삭제 예약
4. **React UI**

   * 업로드 > 포맷 선택 > 결과 페이지
5. **다국어 적용**
6. **광고 삽입**
7. **SEO 설정**
8. **최종 배포**

---

## 🧪 테스트

### 프론트엔드: Jest + React Testing Library

```bash
yarn add -D jest @types/jest ts-jest babel-jest
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Jest 설정 (`jest.config.ts`)

```ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
};
```

### 테스트 설정 파일 (`src/setupTests.ts`)

```ts
import '@testing-library/jest-dom';
```

### 테스트 예시

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders upload button', () => {
  render(<App />);
  expect(screen.getByText(/업로드/i)).toBeInTheDocument();
});
```

---

## 👨‍💻 커밋 컨벤션

```bash
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
docs: 문서 수정
test: 테스트 코드 추가
```

---

## 📬 라이선스

MIT License

```

---

## ✅ 개발 순서 요약 (현업 방식)

| 단계 | 내용 |
|------|------|
| 1단계 | 백엔드 Upload Service부터 개발 (가장 먼저 필요) |
| 2단계 | Convert → Download 순으로 API 구성 |
| 3단계 | 프론트 Upload → Convert → Result 페이지 개발 |
| 4단계 | i18n 적용 및 광고 삽입 |
| 5단계 | 테스트 코드 작성 (Jest + Testing Library) |
| 6단계 | SEO 대응, 정적 페이지 메타태그 |
| 7단계 | Fly.io 배포 및 AdSense 삽입 |

---

### 다음 작업으로 추천:

- [ ] Upload API `main.go` 기본 구조 생성  
- [ ] React 라우팅 초기화 + 업로드 페이지 구성  
- [ ] Jest 초기 테스트 하나 작성해보기
