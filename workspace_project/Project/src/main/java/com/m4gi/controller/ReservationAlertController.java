// src/main/java/com/m4gi/controller/ReservationAlertController.java
package com.m4gi.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.ReservationAlertDTO;
import com.m4gi.dto.UserDTO; 
import com.m4gi.service.ReservationAlertService; 

@RestController
@RequestMapping("/api/reservations/alerts") 
public class ReservationAlertController {

    @Autowired
    private ReservationAlertService reservationAlertService;

    /**
     * 로그인한 사용자에게 해당하는 예약 알림을 조회합니다.
     * 이 알림은 'reservations' 테이블에서 동적으로 생성됩니다.
     * @param session HTTP 세션에서 로그인 사용자 정보를 가져옵니다.
     * @return 해당 사용자에게 해당하는 예약 알림 목록 (ReservationAlertDTO)
     */
    @GetMapping("/user") // GET /api/reservations/alerts/user 요청을 처리합니다.
    public ResponseEntity<List<ReservationAlertDTO>> getUserReservationAlerts(HttpSession session) {
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");

        // 로그인된 사용자 정보가 없는 경우 UNAUTHORIZED (401) 응답을 반환합니다.
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header("Cache-Control", "no-cache, no-store, must-revalidate")
                    .header("Pragma", "no-cache")
                    .header("Expires", "0")
                    .build();
        }

        // 로그인된 사용자의 providerCode와 providerUserId를 가져옵니다.
        int providerCode = loginUser.getProviderCode();
        String providerUserId = loginUser.getProviderUserId();

        // ReservationAlertService를 통해 사용자에게 해당하는 예약 알림을 가져옵니다.
        List<ReservationAlertDTO> alerts = reservationAlertService.getUserReservationAlerts(providerCode, providerUserId);

        // 200 OK 응답과 함께 알림 목록을 반환하며, 캐싱 방지 헤더를 추가합니다.
        return ResponseEntity.ok()
                    .header("Cache-Control", "no-cache, no-store, must-revalidate")
                    .header("Pragma", "no-cache")
                    .header("Expires", "0")
                    .body(alerts);
    }
}