package com.m4gi.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampgroundDTO {
    private String id;              // 캠핑장 ID
    private String name;            // 캠핑장 이름
    private String roadAddress;     // 도로명 주소
    private String contact;         // 연락처
    private String openTime;        // 운영 시작 시간
    private String closeTime;       // 운영 종료 시간
    private String checkIn;         // 체크인 시간
    private String checkOut;        // 체크아웃 시간
    private String status = "운영중"; // 운영중 / 휴무 / 비활성화
    private String createdAt;       // 등록일
    private String updatedAt;       // 수정일
}
