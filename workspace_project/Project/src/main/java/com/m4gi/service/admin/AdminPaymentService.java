package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminPaymentDetailDTO;

import java.util.List;

public interface AdminPaymentService {

    List<AdminPaymentDetailDTO> findAllPayments(Integer reservationStatus, Integer paymentStatus, Integer approvalStatus, String sortOrder, String keyword, String startDate, String endDate);

    AdminPaymentDetailDTO findPaymentByPaymentId(String paymentId);

}
