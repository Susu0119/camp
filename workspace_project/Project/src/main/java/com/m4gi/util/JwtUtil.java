package com.m4gi.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    
    // JWT 비밀키 (실제 운영에서는 환경변수나 설정파일에서 관리)
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // 토큰 유효기간 (1시간)
    private final long JWT_EXPIRATION = 1 * 60 * 60 * 1000;

    // JWT 토큰 생성
    public String generateToken(String kakaoId, String email, String nickname) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("kakaoId", kakaoId);
        claims.put("email", email);
        claims.put("nickname", nickname);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(kakaoId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(secretKey)
                .compact();
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
}
