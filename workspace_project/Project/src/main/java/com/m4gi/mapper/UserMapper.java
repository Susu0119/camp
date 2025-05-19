package com.m4gi.mapper;

import com.m4gi.dto.UserDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {

    // 사용자 전체 목록 조회

    List<UserDTO> findAllUsers();

    // 사용자 상태 변경

    void updateUserStatus(@Param("userId") String userId, @Param("status") String status);

    // 사용자 권한 변경
    void updateUserRole(@Param("userId") String userId, @Param("role") String role);

}
