package com.m4gi.controller;

import java.security.Principal;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
@RequestMapping("/api/MypageUser")
@RequiredArgsConstructor
public class UserMypageController {

	  private final UserMypageService userMypageService;

//	  	// 프로필 사진 수정 
//		  @PutMapping("/profile")
//		  public ResponseEntity<?> updateProfile(@RequestBody UserDTO user, HttpSession session) {
//		      Integer providerCode = (Integer) session.getAttribute("providerCode");
//		      String providerUserId = (String) session.getAttribute("providerUserId");
//	
//		      if (providerCode == null || providerUserId == null) {
//		          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
//		      }
//		      
//		      // 세션에 있는 사용자 정보로 UserDTO에 강제 설정 (위조 방지)
//		      user.setProviderCode(providerCode);
//		      user.setProviderUserId(providerUserId);
//	
//		      userMypageService.updateUserProfile(user);
//		      return ResponseEntity.ok("프로필이 성공적으로 수정되었습니다.");
//		  }
//
//
//	    @GetMapping("/{providerCode}/{providerUserId}")
//	    public ResponseEntity<UserDTO> getUser(@PathVariable int providerCode, @PathVariable String providerUserId) {
//	        UserDTO user = userMypageService.getUserById(providerCode, providerUserId);
//	        return ResponseEntity.ok(user);
//	    }
	    
	    //닉네임 수정
	    @PutMapping("/nickname")
	    public ResponseEntity<?> updateNickname(@RequestBody UserDTO user) {
	        userMypageService.updateUserNickname(user);
	        return ResponseEntity.ok().body("닉네임이 성공적으로 수정되었습니다.");
	    }

	    // 마이페이지 메인 데이터 조회 API
	    @GetMapping("/MypageMain")
	    public ResponseEntity<MyPageMainDTO> getMyPageMain(HttpSession session) {
	        Integer providerCode = (Integer) session.getAttribute("providerCode");
	        String providerUserId = (String) session.getAttribute("providerUserId");

	        if (providerCode == null || providerUserId == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
	        }

	        MyPageMainDTO dto = userMypageService.getMyPageMain(providerCode, providerUserId, session);
	        return ResponseEntity.ok(dto);
	    }



}
