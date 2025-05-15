package com.m4gi.service.admin;

import com.m4gi.dto.UserDTO;
import com.m4gi.dto.UserRoleUpdateDTO;

import java.util.List;

public interface AdminUserService {
    List<UserDTO> getAllUsers();

    void updateUserStatus(String userId, String status);
    void updateUserRole(String userId, String role);
}
