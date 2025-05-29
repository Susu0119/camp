package com.m4gi.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.CanceledReservationsDTO;
import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.service.UserMypageReservationsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/UserMypageReservations")
@RequiredArgsConstructor
public class UserMypageReservationsController {

    private final UserMypageReservationsService userMypageReservationsService;

    // [1] 로그인 세션 기반 - 진행 중인 예약 목록 조회
    @PostMapping("/ongoing")
    public ResponseEntity<List<UserMypageReservationsDTO>> getOngoingReservations(HttpSession session) {
//        Integer providerCode = (Integer) session.getAttribute("providerCode");
//        String providerUserId = (String) session.getAttribute("providerUserId");
    	
    	//테스트용으로 임시 수정 (postman 테스트용)
    	Integer providerCode = 1;
    	String providerUserId = "puid_0010";
    	
        if (providerCode == null || providerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<UserMypageReservationsDTO> reservations =
                userMypageReservationsService.getOngoingReservations(providerCode, providerUserId);

        return ResponseEntity.ok(reservations);
    }

    // [2] 사용자 예약 취소 요청 (JSON Body 방식)
    @PostMapping(value = "/cancelReservation", produces = "application/json; charset=UTF-8")
    public ResponseEntity<String> cancelReservation(@RequestBody CancelReservationRequestDTO dto) {
        try {
            int result = userMypageReservationsService.updateReservationCancel(dto);

            if (result > 0) {
                return ResponseEntity.ok("예약 취소 처리 성공");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("예약을 찾을 수 없습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그에 예외 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러 발생");
        }
    }

    // [3] 취소 및 환불된 예약 목록 조회
    @PostMapping("/canceled")
    public ResponseEntity<List<CanceledReservationsDTO>> getCanceledReservations(HttpSession session) {
//        Integer providerCode = (Integer) session.getAttribute("providerCode");
//        String providerUserId = (String) session.getAttribute("providerUserId");

    	//테스트용으로 임시 수정 (postman 테스트용)
    	Integer providerCode = 1;
    	String providerUserId = "puid_0010";
    	
        if (providerCode == null || providerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<CanceledReservationsDTO> canceledList =
                userMypageReservationsService.getCanceledReservations(providerCode, providerUserId);

        return ResponseEntity.ok(canceledList);
    }
}
