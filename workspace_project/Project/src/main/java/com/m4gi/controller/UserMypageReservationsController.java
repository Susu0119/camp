package com.m4gi.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.CanceledReservationsDTO;
import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.service.UserMypageReservationsService;

import lombok.RequiredArgsConstructor;

@ComponentScan
@RestController 
@RequestMapping("/api/UserMypageReservations")
@RequiredArgsConstructor
public class UserMypageReservationsController {

    private final UserMypageReservationsService userMypageReservationsService;

    // [1] 로그인 세션 기반 예약 조회 
    @GetMapping("/ongoing")
    public List<UserMypageReservationsDTO> getOngoingReservations(HttpSession session) {
        int providerCode = (int) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        return userMypageReservationsService.getOngoingReservations(providerCode, providerUserId);
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
    @GetMapping("/testOngoingSession")
    public List<UserMypageReservationsDTO> getOngoingReservationsWithFakeSession(HttpSession session) {
        // 테스트용 강제 세션 값 주입
        session.setAttribute("providerCode", 1);
        session.setAttribute("providerUserId", "puid_0022");

        int providerCode = (int) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        return userMypageReservationsService.getOngoingReservations(providerCode, providerUserId);
    }

    
	 // 사용자 예약 취소 요청 - JSON Body 방식 (@RequestBody 사용)
    @PostMapping(value = "/cancelReservation",produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> cancelReservation(@RequestBody CancelReservationRequestDTO dto) {
        try {
            int result = userMypageReservationsService.updateReservationCancel(dto);
            if(result > 0) {
                return ResponseEntity.ok("예약 취소 처리 성공");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("예약을 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();  // 로그 꼭 찍히게 하기
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러 발생");
        }
    }

//    //API 테스트
//    @GetMapping(value = "/test", produces = "text/plain; charset=UTF-8")
//    public String test() {
//    	System.out.println("/test API 호출됨");
//        return "API 정상 작동";
//    }
    
    //예약 취소/환불 예약 목록 조회
    @GetMapping("/canceled")
    public List<CanceledReservationsDTO> getCanceledReservations(HttpSession session) {
        int providerCode = (int) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        return userMypageReservationsService.getCanceledReservations(providerCode, providerUserId);
    }
    
    //테스트용 API 
//    @GetMapping("/testCanceledSession")
//    public List<CanceledReservationsDTO> getCanceledReservationsWithFakeSession(HttpSession session) {
//        // 테스트용 강제 세션 값 설정
//        session.setAttribute("providerCode", 1); // 실제 DB에 존재하는 providerCode로 설정
//        session.setAttribute("providerUserId", "puid_0001"); // 존재하는 유저 ID로 설정
//
//        int providerCode = (int) session.getAttribute("providerCode");
//        String providerUserId = (String) session.getAttribute("providerUserId");
//
//        return userMypageReservationsService.getCanceledReservations(providerCode, providerUserId);
//    }





}
