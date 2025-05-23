package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationListDTO;

import java.util.List;
import java.util.Map;

public interface AdminReservationService {
    List<AdminReservationListDTO> findAllReservations();

    AdminReservationDetailDTO findReservationById(String reservationId);

    Map<String, Object> cancelReservation(String reservationId, String reason);

    void processRefundAction(String reservationId, String action);

    public List<AdminReservationListDTO> searchReservations(String name, Integer reservationStatus, Integer refundStatus, String checkinDate);


}