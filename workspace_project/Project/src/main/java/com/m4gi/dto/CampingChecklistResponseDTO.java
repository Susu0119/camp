package com.m4gi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampingChecklistResponseDTO {

    // 기본 정보
    private String campgroundName;
    private String location;
    private String checkInDate;
    private String checkOutDate;
    private int totalPeople;

    // 카테고리별 준비물 리스트
    private List<ChecklistCategory> categories;

    // 특별 추천사항
    private List<String> specialRecommendations;

    // AI 조언
    private String aiAdvice;

    // 생성 시간
    private String generatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChecklistCategory {
        private String categoryName; // ex: "텐트/침구류", "취사용품", "의류"
        private String description; // 카테고리 설명
        private List<ChecklistItem> items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChecklistItem {
        private String itemName; // 준비물 이름
        private String description; // 준비물 설명
        private String priority; // "필수", "권장", "선택"
        private int quantity; // 수량
        private String unit; // 단위 (개, 벌, 병 등)
        private String reason; // 필요한 이유
        private List<String> alternatives; // 대체품 목록
    }
}