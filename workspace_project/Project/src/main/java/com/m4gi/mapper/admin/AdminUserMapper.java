package com.m4gi.mapper.admin;

import com.m4gi.dto.UserDTO;
import com.m4gi.dto.admin.UserDetailDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminUserMapper {

    List<UserDTO> findAllUsers();

    void updateUserRole(Map<String, Object> paramMap);

    void updateUserStatus(Map<String, Object> paramMap);

    List<UserDTO> searchByKeyword(String keyword);

    UserDetailDTO findUserDetail(Map<String, Object> paramMap);

    List<UserDTO> findRecentUsers(int days);
}
