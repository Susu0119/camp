package com.m4gi.service; // 사용자님의 패키지 경로

import java.util.Date;
import java.util.Map;

/**
 * JWT 토큰 블랙리스트를 관리하는 서비스 인터페이스
 * 로그아웃된 토큰을 저장하고 검증하는 기능을 정의합니다.
 */
public interface TokenBlacklistService {

    /**
     * 토큰을 블랙리스트에 추가합니다.
     * 토큰의 만료 시간을 함께 저장하여, 추후 만료된 블랙리스트 토큰을 정리하는 데 사용될 수 있습니다.
     *
     * @param token 블랙리스트에 추가할 JWT 토큰
     */
    void addToBlacklist(String token);

    /**
     * 제공된 토큰이 블랙리스트에 등록되어 있는지 확인합니다.
     * (블랙리스트에 있다는 것은 해당 토큰이 더 이상 유효하지 않음을 의미합니다.)
     *
     * @param token 검증할 JWT 토큰
     * @return 블랙리스트에 있으면 true, 그렇지 않으면 false
     */
    boolean isBlacklisted(String token);

    /**
     * 현재 블랙리스트에 등록된 모든 토큰과 해당 토큰의 원래 만료 시간을 조회합니다.
     * 이 메소드는 주기적인 정리 작업 후의 블랙리스트 상태를 반환할 수 있습니다.
     *
     * @return 블랙리스트에 있는 토큰 문자열을 키로, 해당 토큰의 원래 만료 시간을 값으로 하는 Map
     */
    Map<String, Date> getAllBlacklistedTokens();

    /**
     * 특정 토큰이 블랙리스트에 등록되어 있다면, 해당 토큰의 원래 만료 시간을 조회합니다.
     *
     * @param token 조회할 JWT 토큰
     * @return 토큰이 블랙리스트에 있다면 해당 토큰의 원래 만료 시간, 없다면 null
     */
    Date getBlacklistedTokenExpiry(String token);
}