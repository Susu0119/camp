package com.m4gi.controller.admin;

import com.m4gi.dto.UserDTO;
import com.m4gi.dto.admin.AdminUserDetailDTO;
import com.m4gi.dto.admin.AdminUserRoleUpdateDTO;
import com.m4gi.dto.admin.AdminUserStatusUpdateDTO;
import com.m4gi.service.admin.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    // ✅ 사용자 상태 변경 (providerCode + providerUserId 포함) - 관리자 수동 처리
    @PatchMapping("/status")
    public ResponseEntity<Map<String, String>> updateUserStatus(@RequestBody AdminUserStatusUpdateDTO dto) {
        adminUserService.updateUserStatus(dto.getProviderCode(), dto.getProviderUserId(), dto.getStatus());
        return ResponseEntity.ok(Map.of("message", "상태가 성공적으로 변경되었습니다."));
    }

    // ✅ 사용자 권한 변경 - 단일 변경
    @PatchMapping("/role")
    public ResponseEntity<Map<String, String>> updateUserRole(@RequestBody AdminUserRoleUpdateDTO dto) {
        adminUserService.updateUserRole(dto.getProviderCode(), dto.getProviderUserId(), dto.getRole());
        return ResponseEntity.ok(Map.of("message", "권한이 성공적으로 변경되었습니다."));
    }

    // ✅ 사용자 권한 변경 - 다중 변경
    // @PatchMapping("/roles")

    // // ✅ 날짜 필터(가입일 범위) + 키워드 + 권한/상태 포함 통합 검색 추가
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String userRole,
            @RequestParam(required = false) String userStatus,
            @RequestParam(defaultValue = "DESC") String sortOrder
    ) {
        List<UserDTO> users = adminUserService.findUsersByConditions(keyword, startDate, endDate, userRole, userStatus, sortOrder);
        return ResponseEntity.ok(users);
    }


    // ✅ 사용자 상세 정보 조회
    @GetMapping("/detail")
    public ResponseEntity<AdminUserDetailDTO> getUserDetail(
            @RequestParam int providerCode,
            @RequestParam String providerUserId
    ) {
        return ResponseEntity.ok(adminUserService.getUserDetail(providerCode, providerUserId));
    }

    // ✅ 가입일 필터 (최근 n일 이내)
    @GetMapping("/filter")
    public ResponseEntity<List<UserDTO>> filterByJoinDate(@RequestParam int days) {
        return ResponseEntity.ok(adminUserService.findRecentUsers(days));
    }

    // ✅ 회원 탈퇴 처리 (status = 1로) - 자동 처리
    @PatchMapping("/withdraw")
    public ResponseEntity<Map<String, String>> withdrawUser(@RequestBody AdminUserStatusUpdateDTO dto) {
        adminUserService.updateUserStatus(dto.getProviderCode(), dto.getProviderUserId(), 1);
        return ResponseEntity.ok(Map.of("message", "회원 탈퇴 처리 완료"));
    }

    // ✅ 전체 사용자 목록 조회 (정렬 기준 포함)
    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers(@RequestParam(defaultValue = "DESC") String sortOrder) {
        return ResponseEntity.ok(adminUserService.findAllUsersSorted(sortOrder));
    }

}
