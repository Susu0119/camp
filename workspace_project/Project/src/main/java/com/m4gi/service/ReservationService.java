package com.m4gi.service;

import com.m4gi.dto.ReservationDTO;
import com.m4gi.dto.ReservationSummaryDTO;

import java.util.List;

public interface ReservationService {
    // ReservationService.java
    List<ReservationDTO> getReservationsByProvider(Integer providerCode, String providerUserId);

    ReservationDTO findReservationById(String reservationId);

    List<ReservationSummaryDTO> getReservationSummariesByProvider(
            Integer providerCode, String providerUserId);

    // 예약 환불 상태로 업데이트
    void updateReservationAsRefunded(String reservationId, String cancelReason);
}
	
	

