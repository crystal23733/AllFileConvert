// Package util은 Rate limiting 기능을 제공합니다.
package util

import (
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// RateLimiter는 IP별 요청 제한을 관리합니다.
type RateLimiter struct {
	limiters map[string]*IPLimiter
	mu       sync.RWMutex
	limit    rate.Limit
	burst    int
}

// IPLimiter는 개별 IP의 rate limiter와 마지막 사용 시간을 저장합니다.
type IPLimiter struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

// NewRateLimiter는 새로운 rate limiter를 생성합니다.
// 5분에 3개 요청을 허용합니다.
func NewRateLimiter() *RateLimiter {
	rl := &RateLimiter{
		limiters: make(map[string]*IPLimiter),
		limit:    rate.Every(5 * time.Minute / 3), // 5분에 3개 = 100초마다 1개
		burst:    3,                               // 최대 3개까지 버스트 허용
	}

	// 1시간마다 오래된 항목들을 정리
	go rl.cleanupRoutine()

	return rl
}

// Allow는 주어진 IP가 요청을 할 수 있는지 확인합니다.
func (rl *RateLimiter) Allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	limiter, exists := rl.limiters[ip]
	if !exists {
		limiter = &IPLimiter{
			limiter:  rate.NewLimiter(rl.limit, rl.burst),
			lastSeen: time.Now(),
		}
		rl.limiters[ip] = limiter
	}

	limiter.lastSeen = time.Now()
	return limiter.limiter.Allow()
}

// cleanupRoutine은 1시간 이상 사용되지 않은 IP들을 정리합니다.
func (rl *RateLimiter) cleanupRoutine() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	// for range 패턴 사용 (linter 권장 방식)
	// ticker.C 채널에서 값을 받을 때마다 cleanup 실행
	for range ticker.C {
		rl.cleanup()
	}
}

// cleanup은 오래된 IP 항목들을 제거합니다.
func (rl *RateLimiter) cleanup() {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	cutoff := time.Now().Add(-1 * time.Hour)
	for ip, limiter := range rl.limiters {
		if limiter.lastSeen.Before(cutoff) {
			delete(rl.limiters, ip)
		}
	}
}
