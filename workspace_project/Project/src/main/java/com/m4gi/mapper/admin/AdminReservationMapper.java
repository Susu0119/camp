package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationListDTO;

import java.util.List;

public interface AdminReservationMapper {
    List<AdminReservationListDTO> findAllReservations();

    AdminReservationDetailDTO findReservationById(String reservationId);
}
