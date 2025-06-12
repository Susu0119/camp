package com.m4gi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReportRequestDTO {
    private String reviewId;
    private String reportReason;
}