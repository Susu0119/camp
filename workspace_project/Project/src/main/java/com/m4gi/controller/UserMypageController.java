package com.m4gi.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.web.multipart.MultipartFile;  // 주석 처리해도 무방합니다.
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.MyPageMainDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.service.UserMypageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/mypage")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://34.168.101.140" }, allowCredentials = "true")
public class UserMypageController {

	private final UserMypageService userMypageService;

	/*
	 * // 프로필 사진 수정
	 * 
	 * @PostMapping("/{providerCode}/{providerUserId}/profile")
	 * public ResponseEntity<?> updateUserProfileImage(@PathVariable int
	 * providerCode, @PathVariable String providerUserId,
	 * 
	 * @RequestParam("file") MultipartFile file) {
	 * if (file.isEmpty()) {
	 * return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message",
	 * "업로드할 파일을 선택해주세요."));
	 * }
	 * 
	 * try {
	 * String originalFileName = file.getOriginalFilename();
	 * String extension = "";
	 * if (originalFileName != null && originalFileName.contains(".")) {
	 * extension = originalFileName.substring(originalFileName.lastIndexOf("."));
	 * }
	 * String GCSFileName = UUID.randomUUID().toString() + extension;
	 * 
	 * String gcsFileUrl = fileUploadService.uploadFile(file, GCSFileName,
	 * "profile_images");
	 * 
	 * UserDTO userToUpdate = userMypageService.getUserById(providerCode,
	 * providerUserId);
	 * if (userToUpdate == null) {
	 * return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message",
	 * "해당 사용자를 찾을 수 없습니다."));
	 * }
	 * userToUpdate.setProfileImage(gcsFileUrl);
	 * 
	 * userMypageService.updateUserProfile(userToUpdate);
	 * 
	 * Map<String, Object> responseBody = new HashMap<>();
	 * responseBody.put("profile_url", gcsFileUrl);
	 * 
	 * return ResponseEntity.ok(responseBody);
	 * 
	 * } catch (IOException e) {
	 * e.printStackTrace();
	 * return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	 * .body(Map.of("message", "파일 업로드 중 오류가 발생했습니다: " + e.getMessage()));
	 * } catch (Exception e) {
	 * e.printStackTrace();
	 * return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	 * .body(Map.of("message", "프로필 이미지 업데이트 중 서버 내부 오류가 발생했습니다: " +
	 * e.getMessage()));
	 * }
	 * }
	 */

	// 닉네임 중복 체크 API
	@GetMapping("/nickname/check")
	public ResponseEntity<Map<String, Boolean>> checkNicknameDuplicate(@RequestParam String nickname) {
		boolean isDuplicate = userMypageService.isNicknameDuplicate(nickname);
		Map<String, Boolean> response = Map.of("isDuplicate", isDuplicate);
		return ResponseEntity.ok(response);
	}

	// 닉네임 수정(업데이트)
	@PutMapping("/nickname/update")
	public ResponseEntity<Map<String, Object>> updateNickname(@RequestBody UserDTO user, HttpSession session) {
		UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
		System.out.println("로그인 유저 정보(loginUser): " + loginUser);
		if (loginUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인이 필요합니다."));
		}

		// user에 ID 정보 없으면 세션에서 가져오기
		if (user.getProviderCode() == null) {
			user.setProviderCode(loginUser.getProviderCode());
		}
		if (user.getProviderUserId() == null) {
			user.setProviderUserId(loginUser.getProviderUserId());
		}

		try {
			userMypageService.updateUserNickname(user);

			UserDTO updatedUser = userMypageService.findByEmail(loginUser.getEmail());
			session.setAttribute("loginUser", updatedUser);
			session.setAttribute("userNickname", updatedUser.getNickname());

			return ResponseEntity.ok(Map.of("message", "닉네임이 성공적으로 수정되었습니다."));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "닉네임 수정 실패"));
		}
	}

	// 마이페이지 메인 데이터 조회 API
	@GetMapping("/main")
	public ResponseEntity<?> getMyPageMain(HttpSession session) {
		UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
		if (loginUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인이 필요합니다."));
		}

		Integer providerCode = (Integer) session.getAttribute("providerCode");
		String providerUserId = (String) session.getAttribute("providerUserId");

		if (providerCode == null || providerUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "사용자 정보가 없습니다."));
		}

		MyPageMainDTO dto = userMypageService.getMyPageMain(providerCode, providerUserId, session);
		return ResponseEntity.ok(dto);
	}

	// 회원 탈퇴 (사유 포함)
	@DeleteMapping("/withdraw")
	public ResponseEntity<Map<String, Object>> deleteAccount(@RequestBody Map<String, String> body,
			HttpSession session) {
		try {
			UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
			if (loginUser == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인이 필요합니다."));
			}

			Integer providerCode = (Integer) session.getAttribute("providerCode");
			String providerUserId = (String) session.getAttribute("providerUserId");

			if (providerCode == null || providerUserId == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "사용자 정보가 없습니다."));
			}

			String reason = body.get("reason");
			userMypageService.deactivateUser(providerCode, providerUserId, reason);

			session.invalidate();

			return ResponseEntity.ok(Map.of("message", "회원 탈퇴가 완료되었습니다."));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "탈퇴 처리 실패"));
		}
	}

	// 사용자 정보 수정
	@PutMapping("/update")
	public ResponseEntity<?> updateUserInfo(@RequestBody UserDTO updateDTO, HttpSession session) {
		UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
		if (loginUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인이 필요합니다."));
		}

		String email = (String) session.getAttribute("userEmail");
		if (email == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "사용자 이메일 정보가 없습니다."));
		}

		try {
			UserDTO existingUser = userMypageService.findByEmail(email);
			if (existingUser == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "사용자를 찾을 수 없습니다."));
			}

			if (updateDTO.getNickname() != null) {
				existingUser.setNickname(updateDTO.getNickname());
			}
			if (updateDTO.getPhone() != null) {
				existingUser.setPhone(updateDTO.getPhone());
			}
			if (updateDTO.getChecklistAlert() != null) {
				existingUser.setChecklistAlert(updateDTO.getChecklistAlert());
			}
			if (updateDTO.getReservationAlert() != null) {
				existingUser.setReservationAlert(updateDTO.getReservationAlert());
			}
			if (updateDTO.getVacancyAlert() != null) {
				existingUser.setVacancyAlert(updateDTO.getVacancyAlert());
			}

			userMypageService.updateUserProfile(existingUser);

			session.setAttribute("loginUser", existingUser);
			session.setAttribute("userEmail", existingUser.getEmail());
			session.setAttribute("userNickname", existingUser.getNickname());

			return ResponseEntity.ok(existingUser);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "사용자 정보 수정 실패"));
		}
	}
}
