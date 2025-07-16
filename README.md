# 📁 FlipFile

FlipFile는 다양한 포맷의 영상, 문서, 이미지 파일을 웹에서 빠르게 변환할 수 있는 글로벌 타겟 서비스입니다.  
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

FlipFile/
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
git clone https://github.com/yourname/FlipFile.git
cd FlipFile
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
