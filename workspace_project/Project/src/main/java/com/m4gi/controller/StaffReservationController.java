package com.m4gi.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<StaffReservationDTO>> getReservationListForStaff(
        @RequestParam int providerCode,
        @RequestParam String providerUserId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
		// date가 null 이면 오늘 날짜로 설정
		LocalDate today = LocalDate.now();
        LocalDate from = (startDate != null) ? startDate : today;
        LocalDate to   = (endDate   != null) ? endDate   : today;
        List<StaffReservationDTO> list =
            reservationService.getReservationsByOwnerAndDate(
              providerCode, providerUserId, from, to
            );
        return ResponseEntity.ok(list);
    };
	
	// 캠핑장 관계자 - 체크인 처리
	@PostMapping("/{id}/checkin")
    public ResponseEntity<Void> checkIn(@PathVariable("id") String id) {
        boolean ok = reservationService.checkInReservation(id);
        if (!ok) {
            // 상태가 3(입실전)이 아니면 400 Bad Request
            return ResponseEntity.badRequest().build();
        };
        return ResponseEntity.noContent().build();
    };
};
