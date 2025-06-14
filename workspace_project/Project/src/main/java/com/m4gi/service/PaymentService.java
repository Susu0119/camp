package com.m4gi.service;

import com.m4gi.dto.PaymentDTO;
import com.m4gi.dto.UserDTO;
import java.util.List;
import java.util.Map;

public interface PaymentService {
    

    void savePaymentAndReservation(PaymentDTO paymentDTO, UserDTO currentUser);

    boolean validateAvailableSpots(int zoneId, String startDate, String endDate);

    boolean existsByReservationId(String reservationId);

    Integer getZoneIdBySiteId(String siteId);

}
