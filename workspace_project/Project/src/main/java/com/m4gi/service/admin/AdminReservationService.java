package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationDTO;

import java.util.List;
import java.util.Map;

public interface AdminReservationService {
    List<AdminReservationDTO> findAllReservations();

    AdminReservationDetailDTO findReservationById(String reservationId);

    Map<String, Object> cancelReservation(String reservationId, String cancelReason);

    void processRefundAction(String reservationId, String action);

    List<AdminReservationDTO> searchReservations(
            String name, Integer reservationStatus, Integer refundStatus,
            String checkinDate, String sortOrder, String startDate, String endDate,
            Integer checkinStatus
    );

}