package com.m4gi.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.m4gi.dto.UserDTO;
import com.m4gi.service.FileUploadService;
import com.m4gi.service.UserService;

@RestController
@RequestMapping("/api/user/mypage")
public class UserProfileController {

    private final FileUploadService fileUploadService;
    private final UserService userService;  // UserMypageService 대신 UserService 사용

    @Autowired
    public UserProfileController(FileUploadService fileUploadService, UserService userService) {
        this.fileUploadService = fileUploadService;
        this.userService = userService;
    }

    // 조회용 GET 메서드 추가
    @GetMapping("/{providerCode}/{providerUserId}")
    public ResponseEntity<?> getUserProfile(
            @PathVariable int providerCode,
            @PathVariable String providerUserId) {
        
    	UserDTO userProfile = userService.getUserByProvider(providerCode, providerUserId);

        if (userProfile == null) {
            // 사용자를 찾지 못했을 때 404 응답
            return ResponseEntity.notFound().build();
        }

        // 프로필 이미지 URL이 포함된 UserDTO 반환
        return ResponseEntity.ok(userProfile);
    }
    
    @PostMapping("/{providerCode}/{providerUserId}/profile")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable int providerCode,
            @PathVariable String providerUserId,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "업로드할 파일을 선택해주세요."));
        }

        try {
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + extension;

            String folderName = "profile_images";

            // GCS에 파일 업로드
            String uploadedFileUrl = fileUploadService.uploadFile(file, uniqueFileName, folderName);

            // DB에 프로필 이미지 URL 저장
            boolean updateResult = userService.updateProfileImage(providerCode, providerUserId, uploadedFileUrl);
            System.out.println("updateProfileImage 결과: " + updateResult);
            
            if (!updateResult) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "프로필 이미지 저장에 실패했습니다."));
            }

            Map<String, String> response = new HashMap<>();
            response.put("profile_url", uploadedFileUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "파일 업로드 중 오류가 발생했습니다."));
        }
    }
}
