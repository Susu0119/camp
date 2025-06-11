package com.m4gi.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminCampgroundDetailDTO {

    private int id; // String → int 변경 (campground_id)
    private String name; // 캠핑장 이름 (campground_name)
    private String phone; // 연락처 (campground_phone)
    private String type; // 유형 (campground_type - ENUM string으로 받을 예정)

    private String addrFull; // 전체 주소 (addr_full)
    private String sido; // 시/도
    private String sigungu; // 시/군/구

    private String description; // 설명
    private String campgroundImage; // 이미지 (JSON -> 문자열로 우선 처리)
    private String campgroundVideo; // 홍보영상

    private String environments; // 편의시설 (SET -> 문자열 그대로 받을 것)
    private String area; // 면적 (total_area_sqm)

    private String checkIn; // 입실 시간 (checkin_time)
    private String checkOut; // 퇴실 시간 (checkout_time)

    private String latitude; // 위도
    private String longitude; // 경도
    private String mapService; // 지도 서비스 종류

    private String status; // 상태값 (0,1,2 → 문자열로 변환해서 넘겨도 OK)
    private String createdAt;
    private String updatedAt;
}
