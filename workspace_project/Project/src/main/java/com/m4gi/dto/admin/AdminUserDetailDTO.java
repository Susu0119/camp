package com.m4gi.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminUserDetailDTO {

    private int providerCode;               // 소셜 제공자
    private String providerUserId;          // 소셜 사용자 ID

    private String nickname;                // 닉네임
    private String email;                   // 이메일
    private String phone;                   // 연락처
    private String joinDate;                // 가입일 (yyyy-MM-dd)
    private int reservationCount;           // 예약 횟수
    private int userStatus;                 // 사용자 상태 (0: 활성, 1: 비활성)

}
