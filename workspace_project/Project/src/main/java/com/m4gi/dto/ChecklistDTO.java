package com.m4gi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistDTO {

    // Nullable이 NO인 필드들만 포함
    private String checklistId;
    private Integer providerCode;
    private String providerUserId;
    private String description; // AI 생성된 체크리스트 내용 (JSON 형태)
    private Integer siteId;
    private String reservationId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}