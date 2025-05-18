package com.m4gi.service.admin;

import com.m4gi.dto.UserDTO;
import com.m4gi.dto.admin.UserDetailDTO;
import com.m4gi.mapper.AdminUserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class AdminUserServiceImpl implements AdminUserService {

    private final AdminUserMapper adminUserMapper;

    @Override
    public List<UserDTO> getAllUsers() {
        return adminUserMapper.findAllUsers();
    }

    @Override
    public void updateUserStatus(int providerCode, String providerUserId, int status) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("providerCode", providerCode);
        paramMap.put("providerUserId", providerUserId);
        paramMap.put("status", status);
        adminUserMapper.updateUserStatus(paramMap);
    }

    @Override
    public void updateUserRole(int providerCode, String providerUserId, int role) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("providerCode", providerCode);
        paramMap.put("providerUserId", providerUserId);
        paramMap.put("role", role);
        adminUserMapper.updateUserRole(paramMap);
    }

    @Override
    public List<UserDTO> searchByKeyword(String keyword) {
        return adminUserMapper.searchByKeyword(keyword);
    }

    @Override
    public UserDetailDTO getUserDetail(int providerCode, String providerUserId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("providerCode", providerCode);
        paramMap.put("providerUserId", providerUserId);
        return adminUserMapper.findUserDetail(paramMap);
    }

    @Override
    public List<UserDTO> findRecentUsers(int days) {
        return adminUserMapper.findRecentUsers(days);
    }
}
