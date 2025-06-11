package com.m4gi.dto;

import java.sql.Timestamp;
import java.time.LocalDate;
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

    private Integer noticeId;              // 공지 고유번호 (PK)
//    private String noticeTitle;           // 제목
//    private String noticeContent;         // 내용
//    private Boolean isPublished;          // 게시 여부

//    private LocalDateTime createdAt;      // 생성일시
//    private LocalDateTime updatedAt;      // 수정일시

//    private Integer providerCode;         // 개인 알림일 경우 사용자 구분코드
//    private String providerUserId;        // 개인 알림일 경우 사용자 아이디

    private String reservationId;         // 예약 ID (필요한 경우에만)
    private LocalDate reservationDate;    // 예약 날짜
    private String alertMessage;          // 알림 메시지 (예약 알림 등)

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
    
    private String noticeTitle; 
    private String noticeContent;
    private boolean isPublished;
    private LocalDateTime createdAt; // 또는 LocalDateTime
    private LocalDateTime updatedAt; // 또는 LocalDateTime
    private Integer providerCode; // int 대신 Integer 사용 (null 가능성 대비)
    private String providerUserId;
}
