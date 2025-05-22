package com.m4gi.controller;

import java.util.List;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.*;

import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.service.UserMypageReservationsService;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/UserMypageReservations")
@RequiredArgsConstructor
public class UserMypageReservationsController {

    private final UserMypageReservationsService UserMypageReservationsService;

    // [1] 로그인 세션 기반 예약 조회 
    @GetMapping("/ongoing")
    public List<UserMypageReservationsDTO> getOngoingReservations(HttpSession session) {
        int providerCode = (int) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        return UserMypageReservationsService.getOngoingReservations(providerCode, providerUserId);
    }

//    // [2] 테스트용 API: 쿼리 파라미터로 providerCode, providerUserId 넘기기
//    @GetMapping("/testOngoing")
//    public String testOngoing(@RequestParam String providerCode, @RequestParam String providerUserId) {
//       System.out.println("testOngoing 메서드 호출됨");
//    	return "OK";
//    }
//    
//    // [3] 테스트용: 쿼리 파라미터로 providerCode, providerUserId 받아서 예약 목록 조회
//    @GetMapping("/testOngoingList")
//    public List<UserMypageReservationsDTO> testOngoingList(
//            @RequestParam int providerCode,
//            @RequestParam String providerUserId) {
//
//        System.out.println("testOngoingList 호출됨 - providerCode: " + providerCode + ", providerUserId: " + providerUserId);
//        return UserMypageReservationsService.getOngoingReservations(providerCode, providerUserId);
//    }
//    
//    // [4] 테스트용 세션 주입 + 서비스 호출 API
//    @GetMapping("/testOngoingSession")
//    public List<UserMypageReservationsDTO> getOngoingReservationsWithFakeSession(HttpSession session) {
//        // ⚠ 테스트용 강제 세션 값 주입 (실제 로그인과 무관)
//        session.setAttribute("providerCode", 1);
//        session.setAttribute("providerUserId", "kakao_user_1003");
//
//        int providerCode = (int) session.getAttribute("providerCode");
//        String providerUserId = (String) session.getAttribute("providerUserId");
//
//        return UserMypageReservationsService.getOngoingReservations(providerCode, providerUserId);
//    }


}
