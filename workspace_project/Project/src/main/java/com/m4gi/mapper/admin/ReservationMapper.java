package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.ReservationDetailDTO;
import com.m4gi.dto.admin.ReservationListDTO;

import java.util.List;

public interface ReservationMapper {
    List<ReservationListDTO> findAllReservations();

    ReservationDetailDTO findReservationById(String reservationId);
}
