package com.m4gi.service.admin;

import com.m4gi.dto.UserDTO;
import com.m4gi.dto.admin.AdminUserDetailDTO;

import java.util.List;

public interface AdminUserService {

    // 전체 사용자 목록
    List<UserDTO> getAllUsers();

    // 이름 또는 이메일 검색
    List<UserDTO> searchByKeyword(String keyword);

    // 최근 가입자 조회 (days일 이내)
    List<UserDTO> findRecentUsers(int days);

    // 사용자 상태 업데이트
    void updateUserStatus(int providerCode, String providerUserId, int status);

    // 사용자 권한 업데이트
    void updateUserRole(int providerCode, String providerUserId, int role);

    // 사용자 상세 정보 조회
    AdminUserDetailDTO getUserDetail(int providerCode, String providerUserId);

    // 정렬 기준에 따라 사용자 목록 조회 (최신순/오래된순)
    List<UserDTO> findAllUsersSorted(String sortOrder);

    // 날짜 범위 필터로 조회
    List<UserDTO> findUsersByConditions(String keyword, String startDate, String endDate, String userRole, String userStatus, String sortOrder);

}
