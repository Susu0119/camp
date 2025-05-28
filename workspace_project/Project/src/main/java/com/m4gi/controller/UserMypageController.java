package com.m4gi.controller;

import com.m4gi.service.FileUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.m4gi.dto.UserDTO;
import com.m4gi.service.UserMypageService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/user/mypage")
@RequiredArgsConstructor
public class UserMypageController {

	  private final UserMypageService userMypageService;
	  private final FileUploadService fileUploadService;

	  	// 프로필 사진 수정 
		@PostMapping("/{providerCode}/{providerUserId}/profile")
		public ResponseEntity<?> updateUserProfileImage(
				@PathVariable int providerCode,
				@PathVariable String providerUserId,
				@RequestParam("file") MultipartFile file // 'file'이라는 이름으로 MultipartFile을 받음
		) {
			if (file.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "업로드할 파일을 선택해주세요."));
			}

			try {
				// 1. GCS에 업로드할 고유한 파일명 생성
				//    (예: "사용자ID_UUID.확장자" 또는 그냥 "UUID.확장자")
				//    GCSUploadService의 FOLDER_NAME ('profile_images') 내에 이 파일명으로 저장됩니다.
				String originalFileName = file.getOriginalFilename();
				String extension = "";
				if (originalFileName != null && originalFileName.contains(".")) {
					extension = originalFileName.substring(originalFileName.lastIndexOf("."));
				}
				// GCS 내 'profile_images' 폴더에 저장될 최종 파일명
				String GCSFileName = UUID.randomUUID().toString() + extension;

				// 2. FileUploadService를 사용하여 GCS에 파일 업로드 및 URL 반환받기
				String gcsFileUrl = fileUploadService.uploadFile(file, GCSFileName, "profile_images");

				// 3. 해당 사용자의 UserDTO를 가져와서 profileImage 필드를 GCS URL로 업데이트
				UserDTO userToUpdate = userMypageService.getUserById(providerCode, providerUserId);
				if (userToUpdate == null) {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "해당 사용자를 찾을 수 없습니다."));
				}
				userToUpdate.setProfileImage(gcsFileUrl); // 새로운 프로필 이미지 URL 설정

				// 4. UserMypageService를 통해 사용자 정보 업데이트 (DB에 URL 저장)
				userMypageService.updateUserProfile(userToUpdate);

				// 5. 성공 응답 반환
				Map<String, Object> responseBody = new HashMap<>();

				responseBody.put("profile_url", gcsFileUrl);

				return ResponseEntity.ok(responseBody);

			} catch (IOException e) {
				// 파일 업로드 중 GCS 관련 I/O 예외 처리
				e.printStackTrace();
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body(Map.of("message", "파일 업로드 중 오류가 발생했습니다: " + e.getMessage()));
			} catch (Exception e) {
				// 기타 예외 처리 (예: 사용자 조회 실패 등)
				e.printStackTrace();
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body(Map.of("message", "프로필 이미지 업데이트 중 서버 내부 오류가 발생했습니다: " + e.getMessage()));
			}
		}

	    @GetMapping("/{providerCode}/{providerUserId}")
	    public ResponseEntity<UserDTO> getUser(@PathVariable int providerCode, @PathVariable String providerUserId) {
	        UserDTO user = userMypageService.getUserById(providerCode, providerUserId);
	        return ResponseEntity.ok(user);
	    }
	    
	    //닉네임 수정
	    @PutMapping("/nickname")
	    public ResponseEntity<?> updateNickname(@RequestBody UserDTO user) {
	        userMypageService.updateUserNickname(user);
	        return ResponseEntity.ok().body("닉네임이 성공적으로 수정되었습니다.");
	    }
}
