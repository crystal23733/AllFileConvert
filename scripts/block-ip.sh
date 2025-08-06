#!/bin/bash

# 악성 IP 실시간 차단 스크립트
# 사용법: ./block-ip.sh 123.456.789.0

MALICIOUS_IP=$1
NGINX_CONF_TEMPLATE="/path/to/nginx/nginx.conf.template"

if [ -z "$MALICIOUS_IP" ]; then
    echo "사용법: $0 <악성_IP>"
    exit 1
fi

echo "악성 IP $MALICIOUS_IP 차단 중..."

# 1. nginx 설정에 IP 추가
sed -i "/# 입력 예시:/a\\    $MALICIOUS_IP/32 1;  # 자동 차단 $(date)" $NGINX_CONF_TEMPLATE

# 2. nginx 재로드
docker-compose exec nginx nginx -s reload

# 3. 로그 기록
echo "$(date): Blocked IP $MALICIOUS_IP" >> /var/log/security-blocks.log

# 4. Cloudflare에도 차단 추가 (API 사용)
# curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/firewall/rules" \
#   -H "Authorization: Bearer YOUR_API_TOKEN" \
#   -H "Content-Type: application/json" \
#   --data '{"mode":"block","configuration":{"target":"ip","value":"'$MALICIOUS_IP'"}}'

echo "✅ IP $MALICIOUS_IP 차단 완료!"