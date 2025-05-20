package com.m4gi.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor

public class AdminCampgroundDTO {
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

    public AdminCampgroundDTO() {}

    public AdminCampgroundDTO(String id, String name, String roadAddress, String contact,
                              String openTime, String closeTime, String checkIn, String checkOut) {
        this.id = id;
        this.name = name;
        this.roadAddress = roadAddress;
        this.contact = contact;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRoadAddress() { return roadAddress; }
    public void setRoadAddress(String roadAddress) { this.roadAddress = roadAddress; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getOpenTime() { return openTime; }
    public void setOpenTime(String openTime) { this.openTime = openTime; }

    public String getCloseTime() { return closeTime; }
    public void setCloseTime(String closeTime) { this.closeTime = closeTime; }

    public String getCheckIn() { return checkIn; }
    public void setCheckIn(String checkIn) { this.checkIn = checkIn; }

    public String getCheckOut() { return checkOut; }
    public void setCheckOut(String checkOut) { this.checkOut = checkOut; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

}
