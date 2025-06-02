package com.m4gi.service;

import org.springframework.stereotype.Service; // @Service 어노테이션 사용
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service // Spring Service로 등록
public class RefreshTokenStoreServiceImpl implements RefreshTokenStoreService {

    // key: userIdentifier (예: kakaoId), value: refreshTokenString
    private final Map<String, String> refreshTokenStorage = new ConcurrentHashMap<>();

    @Override
    public void saveToken(String userIdentifier, String refreshToken) {
        refreshTokenStorage.put(userIdentifier, refreshToken);
        System.out.println("리프레시 토큰 저장됨 - 사용자: " + userIdentifier); // 로그 메시지 개선
    }

    @Override
    public String getStoredToken(String userIdentifier) {
        return refreshTokenStorage.get(userIdentifier);
    }

    @Override
    public void removeToken(String userIdentifier) {
        if (refreshTokenStorage.containsKey(userIdentifier)) {
            refreshTokenStorage.remove(userIdentifier);
            System.out.println("리프레시 토큰 삭제됨 - 사용자: " + userIdentifier);
        } else {
            System.out.println("삭제할 리프레시 토큰 없음 - 사용자: " + userIdentifier);
        }
    }

    @Override
    public boolean validateStoredToken(String userIdentifier, String refreshTokenToValidate) {
        String storedToken = refreshTokenStorage.get(userIdentifier);
        boolean isValid = storedToken != null && storedToken.equals(refreshTokenToValidate);
        if (!isValid && storedToken != null) {
            System.out.println("저장된 리프레시 토큰 불일치 - 사용자: " + userIdentifier);
        }
        return isValid;
    }
}