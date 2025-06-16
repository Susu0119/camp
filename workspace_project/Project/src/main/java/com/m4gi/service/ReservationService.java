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
}
	
	

