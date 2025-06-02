package com.m4gi.service;

public interface RefreshTokenStoreService {

    /**
     * 사용자의 리프레시 토큰을 저장합니다.
     * 동일한 식별자에 대해 새로운 토큰이 저장되면 이전 토큰은 덮어쓰입니다.
     *
     * @param userIdentifier 사용자 식별자 (예: kakaoId)
     * @param refreshToken 저장할 리프레시 토큰 문자열
     */
    void saveToken(String userIdentifier, String refreshToken);

    /**
     * 사용자의 저장된 리프레시 토큰을 조회합니다.
     *
     * @param userIdentifier 사용자 식별자
     * @return 저장된 리프레시 토큰 문자열, 없으면 null
     */
    String getStoredToken(String userIdentifier);

    /**
     * 사용자의 리프레시 토큰을 저장소에서 삭제합니다.
     *
     * @param userIdentifier 사용자 식별자
     */
    void removeToken(String userIdentifier);

    /**
     * 제공된 리프레시 토큰이 해당 사용자의 저장된 리프레시 토큰과 일치하는지 검증합니다.
     * (JWT 자체의 유효성 검사(만료 등)는 이 메소드의 책임이 아닙니다. 그건 JwtUtil에서 수행합니다.)
     *
     * @param userIdentifier 사용자 식별자
     * @param refreshTokenToValidate 검증할 리프레시 토큰 문자열
     * @return 저장된 토큰과 일치하면 true, 그렇지 않으면 false
     */
    boolean validateStoredToken(String userIdentifier, String refreshTokenToValidate);
}