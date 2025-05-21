package com.m4gi.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class UserDTO {
    private Integer providerCode;
    private String providerUserId;
    private String email;
    private String nickname;
    private String profileImage;
    private String phone;
    private Integer userRole = 0;
    private Integer point;
    private Boolean checklistAlert;
    private Boolean reservationAlert;
    private Boolean vacancyAlert;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
