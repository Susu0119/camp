package com.m4gi.mapper;

import com.m4gi.dto.PaymentDTO;


public interface PaymentMapper {

    /** 결제 정보 저장 */
    int insert(PaymentDTO dto);
}
