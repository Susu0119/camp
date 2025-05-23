package com.m4gi.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminReviewReportDTO {
    private String reportId;
    private String reviewId;
    private String userId;
    private String reason;
    private int status;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
}