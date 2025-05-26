package com.m4gi.mapper;

import com.m4gi.dto.PaymentDTO;

public interface PaymentMapper {
	
	/* 결제 정보 저장 */
    void insertPayment(PaymentDTO paymentDTO);
    
    /* 결제 번호 자동증가 */
    String getLastPaymentId();

}
