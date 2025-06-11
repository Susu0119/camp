package com.m4gi.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder // 이 어노테이션이 있어야 .builder() 사용 가능
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDTO {
    // 공지 유형 계산용 필드 (DB에는 존재하지 않음)
    public String getTargetType() {
        if (providerCode == null && providerUserId == null) {
            return "ALL";
        } else if (providerCode != null && providerUserId != null) {
            return "PERSONAL";
        } else {
            return "INVALID";
        }
    }
    
    // ✅ 모든 필드명을 카멜케이스로 변경합니다. (DB 컬럼은 그대로 스네이크 케이스)
    private Long noticeId;
    private String noticeTitle;
    private String noticeContent;
    private boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer providerCode;
    private String providerUserId;
    private String reservationId; // 만약 reservation_id 컬럼을 추가했다면
}