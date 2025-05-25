package com.m4gi.service;

import com.m4gi.dto.PaymentDTO;

public interface PaymentService {
    void savePaymentAndReservation(PaymentDTO paymentDTO);
}
