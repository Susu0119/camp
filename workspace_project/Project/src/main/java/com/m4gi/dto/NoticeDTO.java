package com.m4gi.dto;

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
//	private Integer noticeId;
    private String noticeTitle;
    private String noticeContent;
    private Boolean isPublished;
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
	 private String reservationId;        // reservation_id
	    private LocalDate reservationDate;   // reservation_date
	    private LocalDateTime createdAt;     // created_at
	    private String alertMessage;         // alert_message
}
