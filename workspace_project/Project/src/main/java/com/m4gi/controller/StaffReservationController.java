package com.m4gi.controller;

import java.time.LocalDate;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.DailyReservationStatusDTO;
import com.m4gi.dto.StaffReservationDTO;
import com.m4gi.service.StaffReservationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff/reservations")
public class StaffReservationController {
	
	private final StaffReservationService reservationService;
	
	// 캠핑장 관계자 - 전체 예약 조회
	@GetMapping
    public ResponseEntity<DailyReservationStatusDTO> getReservationListForStaff(
        HttpSession session,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");
        
        LocalDate today = LocalDate.now();
        LocalDate from = (startDate != null) ? startDate : today;
        LocalDate to   = (endDate   != null) ? endDate   : today;
        
        // 서비스 호출 및 반환
        DailyReservationStatusDTO result =
            reservationService.getReservationsByOwnerAndDate(
                providerCode, providerUserId, from, to
            );
            
        return ResponseEntity.ok(result);
    }
	
	// 기간 내 숙박 조회
	@GetMapping("/period")
    public ResponseEntity<List<StaffReservationDTO>> getReservationsOverlappingPeriod(
        HttpSession session,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        List<StaffReservationDTO> list = reservationService.getReservationsOverlappingPeriod(
            providerCode, providerUserId, startDate, endDate
        );
        
        return ResponseEntity.ok(list);
    }
	
	// 캠핑장 관계자 - 체크인 처리
	@PostMapping("/{id}/checkin")
    public ResponseEntity<Void> checkIn(@PathVariable("id") String id) {
		boolean ok = reservationService.checkInReservation(id);
        return ok ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    };
    
    // 수동 퇴실 처리
    @PostMapping("/{id}/checkout")
    public ResponseEntity<Void> checkOut(@PathVariable("id") String id) {
        boolean ok = reservationService.checkOutReservation(id);
        return ok ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    };
};
