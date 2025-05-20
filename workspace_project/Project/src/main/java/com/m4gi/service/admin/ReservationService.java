package com.m4gi.service.admin;

import com.m4gi.dto.admin.ReservationDetailDTO;
import com.m4gi.dto.admin.ReservationListDTO;

import java.util.List;

public interface ReservationService {
    List<com.m4gi.dto.admin.ReservationListDTO> findAllReservations();

    ReservationDetailDTO findReservationById(String reservationId);
}
