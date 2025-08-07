#!/bin/bash

# 보안 로그 실시간 모니터링
# 사용법: ./monitor-security.sh

echo "🔍 실시간 보안 모니터링 시작..."
echo "Ctrl+C로 종료"

# 실시간 로그 모니터링
docker-compose logs -f nginx | while read line; do
    # 차단된 요청 감지
    if echo "$line" | grep -q "403\|444\|blocked"; then
        echo "🚨 [$(date)] 차단된 요청: $line"
        
        # IP 추출
        IP=$(echo "$line" | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | head -1)
        
        if [ ! -z "$IP" ]; then
            echo "🎯 악성 IP 감지: $IP"
            
            # 로그 파일에 기록
            echo "$(date): 악성 IP 감지 - $IP" >> /tmp/malicious-ips.log
            
            # 5회 이상 차단되면 자동으로 IP 차단 (선택사항)
            COUNT=$(grep "$IP" /tmp/malicious-ips.log | wc -l)
            if [ $COUNT -ge 5 ]; then
                echo "⚡ IP $IP 자동 차단 (5회 이상 악성 요청)"
                # ./block-ip.sh "$IP"
            fi
        fi
    fi
    
    # 과도한 요청 감지 (429 Too Many Requests)
    if echo "$line" | grep -q "429"; then
        echo "⚠️  [$(date)] 과도한 요청: $line"
    fi
    
    # 수상한 User-Agent 감지
    if echo "$line" | grep -qE "bot|crawler|scanner"; then
        echo "🤖 [$(date)] 봇 요청: $line"
    fi
done