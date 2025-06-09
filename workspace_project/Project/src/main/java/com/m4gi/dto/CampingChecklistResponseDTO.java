package com.m4gi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampingChecklistResponseDTO {

    // 기본 정보 (예약 정보 기반)
    private String campgroundName;
    private String location;
    private String checkInDate;
    private String checkOutDate;
    private int totalPeople;

    // 간단한 추천사항 (3-5개 정도)
    private List<String> specialRecommendations;

    // AI 조언 (한 문단 요약)
    private String aiAdvice;

    // 생성 시간
    private String generatedAt;
}