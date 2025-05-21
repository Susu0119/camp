package com.m4gi.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminUserRoleUpdateDTO {

    private int providerCode;            // 소셜 제공자 (1: kakao, 2: naver, ...)
    private String providerUserId;       // 소셜 사용자 고유 ID

    private int role;                    // 역할: 1 = 사용자, 2 = 캠핑장 관계자, 3 = 관리자
}
