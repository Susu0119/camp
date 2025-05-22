package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationListDTO;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AdminReservationMapper {
    List<AdminReservationListDTO> findAllReservations();

    AdminReservationDetailDTO findReservationById(String reservationId);

    void updateCancellation (
            @Param("reservationId") String reservationId,
            @Param("reservationStatus") String reservationStatus,
            @Param("cancelReason") String cancelReason,
            @Param("refundStatus") String refundStatus,
            @Param("requestedAt") LocalDate requestedAt
    );

    void updateRefundStatus(
            @Param("reservationId") String reservationId,
            @Param("refundStatus") String refundStatus,
            @Param("refundedAt") LocalDateTime refundedAt
    );


}
