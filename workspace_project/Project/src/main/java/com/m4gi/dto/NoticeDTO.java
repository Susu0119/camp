package com.m4gi.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
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
 
    private Long notice_id; // PK (int -> Long으로 매핑해도 무방)
    private String notice_title;
    private String notice_content;
    private boolean is_published; // tinyint(1) -> boolean
    private LocalDateTime created_at; // datetime -> LocalDateTime
    private LocalDateTime updated_at; // datetime -> LocalDateTime
    private Integer providerCode; // int unsigned -> Integer (null 허용)
    private String providerUserId;
    
    
    
    
    
    
    
    
    
    
    
    
}
