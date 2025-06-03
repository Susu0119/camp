package com.m4gi.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
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
    private LocalDateTime joinDate;
    private Integer userStatus;
 }
