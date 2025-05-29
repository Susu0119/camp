package com.m4gi.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoticeDTO {
	private Integer noticeId;
    private String noticeTitle;
    private String noticeContent;
    private Boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
