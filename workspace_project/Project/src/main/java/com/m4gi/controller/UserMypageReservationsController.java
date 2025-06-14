package com.m4gi.controller;

import java.util.List;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.m4gi.dto.CancelReservationRequestDTO;
// import com.m4gi.dto.CanceledReservationsDTO; // 더 이상 사용하지 않음
import com.m4gi.dto.ReservationResponseDTO;
import com.m4gi.dto.UserDTO;
// import com.m4gi.dto.UserMypageReservationsDTO; // 더 이상 사용하지 않음
import com.m4gi.service.UserMypageReservationsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/UserMypageReservations")
@RequiredArgsConstructor
// WebConfig.java에서 전역으로 CORS를 설정하므로, 이 어노테이션은 필요 없습니다.
public class UserMypageReservationsController {

    private final UserMypageReservationsService userMypageReservationsService;

    /**
     * [1] 진행 중인 예약 목록 조회
     */
    @PostMapping("/ongoing")
    public ResponseEntity<List<ReservationResponseDTO>> getOngoingReservations(HttpSession session) {
        System.out.println("==== [getOngoingReservations 호출] ====");

        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            System.out.println("[getOngoingReservations] 로그인 정보 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        if (providerCode == null || providerUserId == null) {
            System.out.println("[getOngoingReservations] providerCode 또는 providerUserId 누락");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationResponseDTO> reservations = userMypageReservationsService
                .getOngoingReservations(providerCode, providerUserId);

        System.out.println("[getOngoingReservations] 조회된 예약 수: " + (reservations == null ? 0 : reservations.size()));
        System.out.println("===================================");

        return ResponseEntity.ok(reservations);
    }

    /**
     * [2] 이용 완료된 예약 목록 조회
     */
    @PostMapping("/completed")
    public ResponseEntity<List<ReservationResponseDTO>> getCompletedReservations(HttpSession session) {
        System.out.println("==== [getCompletedReservations 호출] ====");

        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            System.out.println("[getCompletedReservations] 로그인 정보 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        if (providerCode == null || providerUserId == null) {
            System.out.println("[getCompletedReservations] providerCode 또는 providerUserId 누락");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationResponseDTO> completedList =
                userMypageReservationsService.getCompletedReservations(providerCode, providerUserId);

        System.out.println("[getCompletedReservations] 조회된 완료 예약 수: " + (completedList == null ? 0 : completedList.size()));

        if (completedList != null) {
            for (ReservationResponseDTO dto : completedList) {
                System.out.println("▶ CompletedReservationDTO: " + dto.toString());
            }
        }

        System.out.println("===================================");
        
        return ResponseEntity.ok(completedList);
    }
    
    /**
     * [3] 취소 및 환불된 예약 목록 조회
     */
    @PostMapping("/canceled")
    public ResponseEntity<List<ReservationResponseDTO>> getCanceledReservations(HttpSession session) {
        System.out.println("==== [getCanceledReservations 호출] ====");

        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            System.out.println("[getCanceledReservations] 로그인 정보 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        if (providerCode == null || providerUserId == null) {
            System.out.println("[getCanceledReservations] providerCode 또는 providerUserId 누락");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationResponseDTO> canceledList =
                userMypageReservationsService.getCanceledReservations(providerCode, providerUserId);

        System.out.println("[getCanceledReservations] 조회된 취소 예약 수: " + (canceledList == null ? 0 : canceledList.size()));

        if (canceledList != null) {
            for (ReservationResponseDTO dto : canceledList) {
                System.out.println("▶ CanceledReservationDTO: " + dto.toString());
            }
        }

        System.out.println("===================================");

        return ResponseEntity.ok(canceledList);
    }

    /**
     * [4] 예약 취소 하기
     */
    @PostMapping(value = "/cancelReservation", produces = "application/json; charset=UTF-8")
    public ResponseEntity<String> cancelReservation(@RequestBody CancelReservationRequestDTO dto, HttpSession session) {
        System.out.println("==== [cancelReservation 호출] ====");
        System.out.println("취소 요청 데이터: " + dto);

        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            System.out.println("[cancelReservation] 로그인 정보 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
        	int result = userMypageReservationsService.updateReservationCancel(dto, loginUser);

            System.out.println("[cancelReservation] 서비스 처리 결과: " + result);

            if (result > 0) {
                System.out.println("예약 취소 처리 성공");
                return ResponseEntity.ok("예약 취소 처리 성공");
            } else {
                System.out.println("예약을 찾을 수 없음");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("예약을 찾을 수 없습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("[cancelReservation] 서버 에러 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러 발생");
        } finally {
            System.out.println("===================================");
        }
    }
}
