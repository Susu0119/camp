package com.m4gi.service;

import java.time.LocalDate;
import java.util.List;

import com.m4gi.dto.StaffReservationDTO;

public interface StaffReservationService {
	
	// 캠핑장 관계자 - 전체 예약 조회
	public List<StaffReservationDTO> getReservationsByOwnerAndDate(int providerCode, String providerUserId, LocalDate startDate, LocalDate endDate);
	
	// 캠핑장 관계자 - 체크인 처리
	public boolean checkInReservation(String reservationId);
	
};
