package com.m4gi.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.ReservationAlertDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.service.ReservationAlertService;

@RestController
@RequestMapping("/api/reservation-alerts") // 예약 알림 전용 엔드포인트

public class ReservationAlertController {

	@Autowired
    private ReservationAlertService reservationAlertService;

	 @GetMapping("/user/{providerCode}/{providerUserId}") 
	 public ResponseEntity<List<ReservationAlertDTO>> getUserReservationAlerts(
	            @PathVariable int providerCode, // <-- @PathVariable 어노테이션 추가
	            @PathVariable String providerUserId, // <-- @PathVariable 어노테이션 추가
	            HttpSession session) {
	        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
	        if (loginUser == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                        .header("Cache-Control", "no-cache, no-store, must-revalidate")
	                        .header("Pragma", "no-cache")
	                        .header("Expires", "0")
	                        .build();
	        }

	        // 받아온 providerCode와 providerUserId를 사용하여 서비스 호출
	        List<ReservationAlertDTO> alerts = reservationAlertService.getReservationAlertsForUser(providerCode, providerUserId);

	        return ResponseEntity.ok()
	                    .header("Cache-Control", "no-cache, no-store, must-revalidate")
	                    .header("Pragma", "no-cache")
	                    .header("Expires", "0")
	                    .body(alerts);
	    }
}
