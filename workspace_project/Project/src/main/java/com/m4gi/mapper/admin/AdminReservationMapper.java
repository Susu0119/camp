package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface AdminReservationMapper {
    List<AdminReservationDTO> findAllReservations();

    AdminReservationDetailDTO findReservationById(String reservationId);

    void updateCancellation(
            @Param("reservationId") String reservationId,
            @Param("reservationStatus") int reservationStatus,
            @Param("cancelReason") String cancelReason,
            @Param("customReason") String customReason,
            @Param("refundStatus") int refundStatus,
            @Param("requestedAt") LocalDate requestedAt
    );

    int updateRefundStatusWithType(
            @Param("reservationId") String reservationId,
            @Param("refundStatus") int refundStatus,
            @Param("refundedAt") LocalDateTime refundedAt,
            @Param("refundType") int refundType
    );

    List<AdminReservationDTO> searchReservations(
            @Param("name") String name,
            @Param("reservationStatus") Integer reservationStatus,
            @Param("refundStatus") Integer refundStatus,
            @Param("checkinDate") String checkinDate,
            @Param("sortOrder") String sortOrder,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("checkinStatus") Integer checkinStatus
    );

}