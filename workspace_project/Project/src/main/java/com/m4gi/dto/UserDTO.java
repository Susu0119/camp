package com.m4gi.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserDTO {
    private int providerCode;              // 소셜 제공자 (1: kakao, 2: naver, ...)
    private String providerUserId;         // 소셜 사용자 고유 ID

    private String nickname;               // 사용자 닉네임
    private String email;                  // 이메일
    private String phone;                  // 전화번호
    private int role;                      // 사용자 역할 (1: 사용자, 2: 관계자, 3: 관리자)

    private LocalDateTime joinDate;
}
