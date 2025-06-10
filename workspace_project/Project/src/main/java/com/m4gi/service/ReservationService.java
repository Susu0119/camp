package com.m4gi.service;

import com.m4gi.dto.ReservationDTO;

public interface ReservationService {
	
	   ReservationDTO findReservationById(String reservationId);
}
