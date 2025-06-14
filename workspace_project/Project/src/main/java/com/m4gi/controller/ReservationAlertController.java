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
@RequestMapping("/api/reservation-alerts") // 예약 알림 전용 엔드포인트

public class ReservationAlertController {

	@Autowired
    private ReservationAlertService reservationAlertService;

	 @GetMapping 
	    public ResponseEntity<List<ReservationAlertDTO>> getUserReservationAlerts(HttpSession session) {
	        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
	        if (loginUser == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                    .header("Cache-Control", "no-cache, no-store, must-revalidate")
	                    .header("Pragma", "no-cache")
	                    .header("Expires", "0")
	                    .build();
	        }

	        int providerCode = loginUser.getProviderCode();
	        String providerUserId = loginUser.getProviderUserId();

	        List<ReservationAlertDTO> alerts = reservationAlertService.getReservationAlertsForUser(providerCode, providerUserId);

	        return ResponseEntity.ok()
	                .header("Cache-Control", "no-cache, no-store, must-revalidate")
	                .header("Pragma", "no-cache")
	                .header("Expires", "0")
	                .body(alerts);
	    }
}
