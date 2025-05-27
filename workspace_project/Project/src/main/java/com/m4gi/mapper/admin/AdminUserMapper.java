package com.m4gi.mapper.admin;

import com.m4gi.dto.UserDTO;
import com.m4gi.dto.admin.AdminUserDetailDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminUserMapper {

    List<UserDTO> findAllUsers();

    void updateUserRole(Map<String, Object> paramMap);

    void updateUserStatus(Map<String, Object> paramMap);

    List<UserDTO> searchByKeyword(String keyword);

    AdminUserDetailDTO findUserDetail(Map<String, Object> paramMap);

    List<UserDTO> findRecentUsers(int days);

    List<UserDTO> findAllUsersSorted(Map<String, Object> paramMap);

    List<UserDTO> findUsersByConditions(Map<String, Object> params);

}
