package com.m4gi.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminUserStatusUpdateDTO {

    private int providerCode;            // 소셜 제공자
    private String providerUserId;       // 사용자 ID

    private int status;                  // 상태: 0 = 활성, 1 = 비활성 (삭제 느낌)
}
