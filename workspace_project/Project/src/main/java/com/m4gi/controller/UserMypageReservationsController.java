package com.m4gi.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.CanceledReservationsDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.service.UserMypageReservationsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/UserMypageReservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserMypageReservationsController {

    private final UserMypageReservationsService userMypageReservationsService;

    // [1] 로그인 세션 기반 - 진행 중인 예약 목록 조회
    @PostMapping("/ongoing")
    public ResponseEntity<List<UserMypageReservationsDTO>> getOngoingReservations(HttpSession session) {

        // 세션 기반 인증 확인
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        System.out.println("==== [세션 정보 확인] ====");
        System.out.println("loginUser: " + loginUser);
        System.out.println("providerCode: " + providerCode);
        System.out.println("providerUserId: " + providerUserId);
        System.out.println("========================");
        
        if (providerCode == null || providerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<UserMypageReservationsDTO> reservations = userMypageReservationsService
                .getOngoingReservations(providerCode, providerUserId);

        return ResponseEntity.ok(reservations);
    }

    // [2] 예약 취소 하기 
    @PostMapping(value = "/cancelReservation", produces = "application/json; charset=UTF-8")
    public ResponseEntity<String> cancelReservation(@RequestBody CancelReservationRequestDTO dto, HttpSession session) {
        // 세션 기반 인증 확인
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

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
        // 세션 기반 인증 확인
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        if (providerCode == null || providerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<CanceledReservationsDTO> canceledList =
                userMypageReservationsService.getCanceledReservations(providerCode, providerUserId);

        return ResponseEntity.ok(canceledList);
    }
    
    //[4] 이용 완료된 예약 목록 조회
    @PostMapping("/completed")
    public ResponseEntity<List<UserMypageReservationsDTO>> getCompletedReservations(HttpSession session) {
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        if (providerCode == null || providerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<UserMypageReservationsDTO> completedList =
                userMypageReservationsService.getCompletedReservations(providerCode, providerUserId);

        return ResponseEntity.ok(completedList);
    }
    
    
    
    
    
    
    //강제 세션 받아오는 api, 나중에 삭제해야함
    @PostMapping("/forceSession")
    public ResponseEntity<String> forceSession(HttpSession session) {
        // 강제로 세션에 로그인 사용자 정보 넣기
        UserDTO loginUser = new UserDTO();
        loginUser.setProviderCode(1);
        loginUser.setProviderUserId("4282119328");
        // 필요한 UserDTO 필드가 더 있다면 적절히 설정하세요

        session.setAttribute("loginUser", loginUser);
        session.setAttribute("providerCode", 1);
        session.setAttribute("providerUserId", "4282119328");

        return ResponseEntity.ok("세션 강제 설정 완료");
    }


    	
}
