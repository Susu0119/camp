package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.AdminPaymentDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminPaymentMapper {

    List<AdminPaymentDTO> findAllPayments();

    AdminPaymentDTO findPaymentByReservationId(String reservationId);

    void updatePaymentStatus(@Param("reservationId") String reservationId,
                             @Param("paymentStatus") int paymentStatus);

}
