package com.m4gi.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUserStatusUpdateDTO {
    private int providerCode;
    private String providerUserId;

    private int status;                 // 상태: 0 = 활성, 1 = 비활성 (삭제 느낌)
}
