package com.m4gi.mapper;

import com.m4gi.dto.PaymentDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PaymentMapper {
	
	/* 결제 정보 저장 */
    void insertPayment(PaymentDTO paymentDTO);
    
    /* 결제 번호 자동증가 */
    String getLastPaymentId();
    
//    /* 중복 결제 확인 */
//    boolean existsByReservationId(@Param("reservationId") String reservationId);

}
