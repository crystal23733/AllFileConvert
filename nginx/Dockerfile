# 공식 nginx 이미지 사용
FROM nginx:alpine

# envsubst를 위한 gettext 패키지 설치
RUN apk add --no-cache gettext

# 커스텀 entrypoint 스크립트 복사
COPY docker-entrypoint.sh /docker-entrypoint.sh

# nginx 설정 템플릿 복사
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# 스크립트 실행 권한 부여
RUN chmod +x /docker-entrypoint.sh

# 기본 nginx 설정 제거 (우리가 동적으로 생성할 예정)
RUN rm -f /etc/nginx/nginx.conf

# 커스텀 entrypoint 설정
ENTRYPOINT ["/docker-entrypoint.sh"]

# 기본 포트 노출
EXPOSE 80 443