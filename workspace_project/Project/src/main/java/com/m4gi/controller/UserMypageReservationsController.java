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
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // 리액트 개발서버 주소와 CORS 설정
public class UserMypageReservationsController {

    private final UserMypageReservationsService userMypageReservationsService;

    /**
     * [1] 로그인 세션 기반 - 진행 중인 예약 목록 조회
     * 세션에서 로그인 정보와 providerCode, providerUserId 가져와 서비스 호출 후 리스트 반환
     * (여기서 UserMypageReservationsDTO 내에 images 필드도 포함되어 전달됨)
     */
    @PostMapping("/ongoing")
    public ResponseEntity<List<UserMypageReservationsDTO>> getOngoingReservations(HttpSession session) {
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

        List<UserMypageReservationsDTO> reservations = userMypageReservationsService
                .getOngoingReservations(providerCode, providerUserId);

        System.out.println("[getOngoingReservations] 조회된 예약 수: " + (reservations == null ? 0 : reservations.size()));
        System.out.println("===================================");

        return ResponseEntity.ok(reservations);
    }

    /**
     * [2] 예약 취소 하기
     * JSON 바디로 예약 취소 요청 DTO를 받아 서비스 호출 후 성공 여부 반환
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
            int result = userMypageReservationsService.updateReservationCancel(dto);

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

    /**
     * [3] 취소 및 환불된 예약 목록 조회
     */
    @PostMapping("/canceled")
    public ResponseEntity<List<CanceledReservationsDTO>> getCanceledReservations(HttpSession session) {
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

        List<CanceledReservationsDTO> canceledList =
                userMypageReservationsService.getCanceledReservations(providerCode, providerUserId);

        System.out.println("[getCanceledReservations] 조회된 취소 예약 수: " + (canceledList == null ? 0 : canceledList.size()));

        if (canceledList != null) {
            for (CanceledReservationsDTO dto : canceledList) {
                System.out.println("▶ CanceledReservationDTO: " + dto.toString());
            }
        }

        System.out.println("===================================");

        return ResponseEntity.ok(canceledList);
    }

    /**
     * [4] 이용 완료된 예약 목록 조회
     */
    @PostMapping("/completed")
    public ResponseEntity<List<UserMypageReservationsDTO>> getCompletedReservations(HttpSession session) {
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

        List<UserMypageReservationsDTO> completedList =
                userMypageReservationsService.getCompletedReservations(providerCode, providerUserId);

        System.out.println("[getCompletedReservations] 조회된 완료 예약 수: " + (completedList == null ? 0 : completedList.size()));

        if (completedList != null) {
            for (UserMypageReservationsDTO dto : completedList) {
                System.out.println("▶ CompletedReservationDTO: " + dto.toString());
            }
        }

        System.out.println("===================================");

        return ResponseEntity.ok(completedList);
    }
}
