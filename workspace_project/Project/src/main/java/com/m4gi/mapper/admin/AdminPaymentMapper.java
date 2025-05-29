package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.AdminPaymentDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminPaymentMapper {

    List<AdminPaymentDetailDTO> findAllPayments(Map<String, Object> params);

    AdminPaymentDetailDTO findPaymentByReservationId(String reservationId);

    void updatePaymentStatus(@Param("reservationId") String reservationId,
                             @Param("paymentStatus") int paymentStatus);

}
