package com.m4gi.service.admin;

import com.m4gi.dto.UserDTO;
import com.m4gi.dto.UserRoleUpdateDTO;
import com.m4gi.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminUserServiceImpl implements AdminUserService{

    private final UserMapper userMapper;

    public AdminUserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userMapper.findAllUsers();
    }

    @Override
    public void updateUserStatus(String userId, String status) {
        userMapper.updateUserStatus(userId, status);
    }

    @Override
    public void updateUserRole(String userId, String role) {
        userMapper.updateUserRole(userId, role);
    }
}
