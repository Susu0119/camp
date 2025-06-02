package com.m4gi.service; // 사용자님의 패키지 경로

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.m4gi.util.JWTUtil;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * TokenBlacklistService 인터페이스의 인메모리 구현체.
 * ConcurrentHashMap을 사용하여 블랙리스트를 관리합니다.
 * (주의: 실제 운영 환경에서는 Redis 등의 외부 지속성 저장소 사용을 강력히 권장합니다.)
 */
@Service // Spring Service Bean으로 등록
public class TokenBlacklistServiceImpl implements TokenBlacklistService {

    @Autowired // ✨ 필드 주입 방식 사용
    private JWTUtil jwtUtil;

    // 블랙리스트 저장소 (토큰 문자열 -> 원래 만료 시간)
    private final Map<String, Date> blacklistedTokens = new ConcurrentHashMap<>();

    @Override
    public void addToBlacklist(String token) {
        if (token == null || token.isBlank()) {
            System.err.println("TokenBlacklist: 블랙리스트 추가 시도 - 토큰이 null이거나 비어있음.");
            return;
        }
        try {
            Date expiryDate = this.jwtUtil.getExpirationDateFromToken(token);
            if (expiryDate != null) {
                blacklistedTokens.put(token, expiryDate);
                System.out.println("TokenBlacklist: 토큰 추가됨 - " + token.substring(0, Math.min(10, token.length())) + "...");
                cleanupExpiredTokens();
            } else {
                System.err.println("TokenBlacklist: 토큰 추가 실패 (만료 시간 추출 불가) - " + token.substring(0, Math.min(10, token.length())) + "...");
            }
        } catch (Exception e) {
            System.err.println("TokenBlacklist: 토큰 추가 중 예외 발생 - "
                    + e.getMessage() + ", 토큰: " + token.substring(0, Math.min(10, token.length())) + "...");
        }
    }

    @Override
    public boolean isBlacklisted(String token) {
        if (token == null) {
            return false;
        }
        return blacklistedTokens.containsKey(token);
    }

    private void cleanupExpiredTokens() {
        Date now = new Date();
        int initialSize = blacklistedTokens.size();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue() != null && entry.getValue().before(now));
        int cleanedSize = blacklistedTokens.size();
        if (initialSize > cleanedSize) {
            System.out.println("TokenBlacklist: 만료된 토큰 " + (initialSize - cleanedSize) + "개 정리됨.");
        }
    }

    @Override
    public Map<String, Date> getAllBlacklistedTokens() {
        cleanupExpiredTokens();
        return new HashMap<>(blacklistedTokens);
    }

    @Override
    public Date getBlacklistedTokenExpiry(String token) {
        if (token == null) {
            return null;
        }
        return blacklistedTokens.get(token);
    }
}