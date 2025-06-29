package com.m4gi.dto;

import java.util.Set;

import lombok.Data;

@Data
public class CampgroundCardDTO {
    private int campgroundId;
    private String campgroundName;
    private Set<String> campgroundType;
    private String addrSido;
    private String addrSigungu;
    private Integer campgroundPrice; // 캠핑장 내의 최저 구역 가격
    private String campgroundImage;

    private Float reviewRatingAvg; // 리뷰 평균 점수
    private Integer totalCurrentStock; // 재고량 합계

    private Integer isWishlisted; // 캠핑장 찜 여부
}
