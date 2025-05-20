package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationListDTO;

import java.util.List;

public interface AdminReservationService {
    List<AdminReservationListDTO> findAllReservations();

    AdminReservationDetailDTO findReservationById(String reservationId);
}
