package com.m4gi.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JWTUtil {
    
    // JWT 비밀키 (실제 운영에서는 환경변수나 설정파일에서 관리)
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // 엑세스 토큰 유효기간 (30분)
    private final long JWT_EXPIRATION = 1 * 30 * 60 * 1000;

    // 리프레시 토큰 유효기간 (7일)
    private final long REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

    // JWT 토큰 생성
    public String generateAccessToken(String kakaoId, String email, String nickname, String kakaoAccessToken) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("kakaoId", kakaoId);
        claims.put("email", email);
        claims.put("nickname", nickname);
        // 카카오 액세스 토큰은 리프레시 토큰 로직과 직접 관련 없으므로, 계속 유지할지 여부 결정 필요
        // 만약 카카오 세션 연장이 필요하다면 유지, 그렇지 않다면 제거 고려
        claims.put("kakaoAccessToken", kakaoAccessToken);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(kakaoId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(secretKey)
                .compact();
    }

    public String generateRefreshToken(String kakaoId) {
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .setClaims(claims) // 필요 시 추가 클레임
                .setSubject(kakaoId) // 주체는 사용자를 식별할 수 있는 값 (kakaoId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(secretKey) // 동일 키 사용
                .compact();
    }

    public long getRefreshTokenExpirationMillis() {
        return REFRESH_TOKEN_EXPIRATION;
    }

    // JWT 토큰에서 사용자 ID 추출
    public String getKakaoIdFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    // JWT 토큰에서 이메일 추출
    public String getEmailFromToken(String token) {
        return (String) getClaimsFromToken(token).get("email");
    }

    // JWT 토큰에서 닉네임 추출
    public String getNicknameFromToken(String token) {
        return (String) getClaimsFromToken(token).get("nickname");
    }

    // JWT 토큰에서 카카오 액세스 토큰 추출
    public String getKakaoAccessToken(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return (String) claims.get("kakaoAccessToken");
        } catch (Exception e) {
            return null;
        }
    }

    // JWT 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            getClaimsFromToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // JWT 토큰에서 Claims 추출
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 토큰 만료 여부 확인
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return true;
        }
    }
    
    // 토큰에서 만료 시간 가져오기
    public Date getExpirationDateFromToken(String token) {
        return getClaimsFromToken(token).getExpiration();
    }

    public String getKakaoIdFromTokenEvenIfExpired(String token) {
        try {
            // 1. 정상적으로 Subject 추출 시도 (만료 안된 경우 getKakaoIdFromToken -> getClaimsFromToken 호출)
            // getClaimsFromToken은 만료 시 ExpiredJwtException을 던집니다.
            return getClaimsFromToken(token).getSubject();
        } catch (ExpiredJwtException e) {
            // 2. 토큰이 만료된 경우, ExpiredJwtException 객체에서 Claims를 가져와 Subject 반환
            System.out.println("Token is expired. Extracting subject from expired token's claims for cleanup: " + token.substring(0, Math.min(10,token.length())) + "...");
            return e.getClaims().getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            // 3. 그 외 JWT 관련 예외 (형식 오류, 서명 불일치 등)
            // 이 경우는 Subject를 안전하게 추출하기 어려움
            System.err.println("Invalid token format or signature (getKakaoIdFromTokenEvenIfExpired for token " + token.substring(0, Math.min(10,token.length())) + "...): " + e.getMessage());
            return null; // 또는 예외를 다시 던지거나, 로깅 후 null 반환
        }
    }
}
