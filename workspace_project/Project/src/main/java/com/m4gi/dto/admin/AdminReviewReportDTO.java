package com.m4gi.dto.admin;

public class AdminReviewReportDTO {
    private String reportId;
    private String reviewId;
    private String userId;
    private String reason;
    private String status;

    public AdminReviewReportDTO() {}

    public AdminReviewReportDTO(String reportId, String reviewId, String userId, String reason, String status) {
        this.reportId = reportId;
        this.reviewId = reviewId;
        this.userId = userId;
        this.reason = reason;
        this.status = status;
    }

    // Getters and Setters
    public String getReportId() { return reportId; }
    public void setReportId(String reportId) { this.reportId = reportId; }

    public String getReviewId() { return reviewId; }
    public void setReviewId(String reviewId) { this.reviewId = reviewId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
