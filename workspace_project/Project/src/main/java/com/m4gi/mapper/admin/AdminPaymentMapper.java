package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.AdminPaymentDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminPaymentMapper {

    List<AdminPaymentDetailDTO> findAllPayments(Map<String, Object> params);

    AdminPaymentDetailDTO findPaymentByPaymentId(String paymentId);

    // 환불 처리 후 결제 상태 동기화(예약ID 기준)
    void updatePaymentStatus(@Param("reservationId") String reservationId,
                             @Param("paymentStatus") int paymentStatus);

}
