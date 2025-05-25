package com.m4gi.dto;

import java.util.List;

import lombok.Data;

@Data
public class CampgroundSearchDTO {
	// 검색 조건
    private String campgroundName;
    private List<String> addrSigunguList;
    private String startDate;
    private String endDate;
    private int people;

    // 정렬 조건
    private String sort;                      // 정렬 기준 (예: rating, price_low 등)

    // 페이징 조건
    private int limit;                        // 한 번에 가져올 캠핑장 수
    private int offset;                       // 몇 번째부터 시작할지 (페이지 번호 * limit)
    
    // 로그인 사용자 정보 (위시리스트용, 임시) 
    private int providerCode;
    private String providerUserId;
}
