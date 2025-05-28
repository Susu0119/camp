package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminPaymentDTO;

import java.util.List;

public interface AdminPaymentService {

    List<AdminPaymentDTO> findAllPayments();

    AdminPaymentDTO findPaymentByReservationId(String reservationId);
}
