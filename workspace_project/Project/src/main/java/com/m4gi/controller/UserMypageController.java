package com.m4gi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.UserDTO;
import com.m4gi.service.UserMypageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/MypageUser")
@RequiredArgsConstructor
public class UserMypageController {

	  private final UserMypageService userMypageService;

	  	// 프로필 사진 수정 
	    @PutMapping("/profile")
	    public ResponseEntity<?> updateProfile(@RequestBody UserDTO user) {
	        userMypageService.updateUserProfile(user);
	        return ResponseEntity.ok().body("프로필이 성공적으로 수정되었습니다.");
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
