package com.m4gi.controller.admin;

import com.m4gi.dto.UserDTO;
import com.m4gi.dto.UserRoleUpdateDTO;
import com.m4gi.dto.UserStatusUpdateDTO;
import com.m4gi.service.admin.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;

    }

    // 전체 사용자 목록 조회

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> userList = adminUserService.getAllUsers();
        return ResponseEntity.ok(userList);

    }

    // 사용자 상태 변경

    @PatchMapping("/{userId}/status")
    public ResponseEntity<Map<String, String>> updateUserStatus(
            @PathVariable String userId,
            @RequestBody UserStatusUpdateDTO dto) {

        adminUserService.updateUserStatus(userId, dto.getStatus());
        return ResponseEntity.ok(Map.of("message", "상태가 성공적으로 변경되었습니다."));
    }

    // 사용자 권한 변경

    @PatchMapping("/{userId}/role")
    public ResponseEntity<Map<String, String>> updateUserRole(
            @PathVariable String userId,
            @RequestBody UserRoleUpdateDTO dto) {

        adminUserService.updateUserRole(userId, dto.getRole());
        return ResponseEntity.ok(Map.of("message", "권한이 성공적으로 변경되었습니다."));
    }


}
