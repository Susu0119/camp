package com.m4gi.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private String userId;
    private String username;
    private String email;
    private String role;
    private String status;
}
