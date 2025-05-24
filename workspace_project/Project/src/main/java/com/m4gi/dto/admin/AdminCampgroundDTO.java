package com.m4gi.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminCampgroundDTO {

    private String id;              // 캠핑장 ID
    private String name;            // 캠핑장 이름
    private String roadAddress;     // 도로명 주소 (addr_full)
    private String phone;           // 연락처 (campground_phone)
    private String type;            // 캠핑장 유형 (campground_type)
    private String sido;            // 시/도 (addr_sido)
    private String sigungu;         // 시/군/구 (addr_sigungu)
    private String area;            // 총 면적 (total_area_sqm)

    private String checkIn;         // 체크인 시간
    private String checkOut;        // 체크아웃 시간
    private String openTime;        // 운영 시작 시간 (DB엔 없지만 UI 상 편의)
    private String closeTime;       // 운영 종료 시간 (DB엔 없지만 UI 상 편의)

    private String status;          // 상태값 (운영중 / 휴무중 / 비활성화)
    private String createdAt;       // 등록일
    private String updatedAt;       // 수정일

    public AdminCampgroundDTO(String id, String name, String roadAddress, String phone,
                              String checkIn, String checkOut, String status,
                              String createdAt, String updatedAt) {
        this.id = id;
        this.name = name;
        this.roadAddress = roadAddress;
        this.phone = phone;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
