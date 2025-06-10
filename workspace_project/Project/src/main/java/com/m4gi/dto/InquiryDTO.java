package com.m4gi.dto;

import lombok.Data;

import java.util.Date;

@Data
public class InquiryDTO {
    private String  inquiriesId;      // varchar PK (UUID)
    private int     providerCode;
    private String  providerUserId;

    private Integer campgroundId;     // nullable
    private String  reservationId;    // nullable

    private int     category;         // 0:예약·결제, 1:분실물, ...
    private String  message;          // 문의 내용
    private String  responseMessage;  // 답변

    private String  attachments;      // JSON 문자열 (List<String>)
    private int  inquiriesStatus;  // 0:미답변, 1:답변완료
    private Date createdAt;
    private Date respondedAt;
}

