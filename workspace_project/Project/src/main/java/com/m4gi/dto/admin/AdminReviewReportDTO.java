package com.m4gi.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminReviewReportDTO {
    private String reportId;         // 신고 ID
    private String reviewId;         // 신고된 리뷰 ID
    private String reporterId;       // 신고자 ID (provider_user_id)
    private String campgroundName;   // 캠핑장명 (JOIN 필요)
    private String reportReasonType; // 요약된 신고 사유 (ex. 욕설, 허위 등)
    private int reportStatus;        // 처리 상태 (1: 대기, 2: 완료)
    private LocalDateTime createdAt; // 신고 일시

}