package com.m4gi.dto.admin;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AdminReviewReportDetailDTO {

    private String reportId;           // 신고 ID
    private String reviewId;           // 리뷰 ID
    private String reporterId;         // 신고자 ID
    private String reporterNickname;   // 신고자 닉네임 (users에서 조인)

    private String campgroundName;     // 캠핑장 이름
    private String siteName;           // 사이트 이름
    private String reportReason;       // 상세 신고 사유 (텍스트 전체)
    private int reportStatus;          // 처리 상태 (1: 대기, 2: 완료)

    private LocalDateTime createdAt;   // 신고일시
    private LocalDateTime processedAt; // 처리일시 (nullable)
}