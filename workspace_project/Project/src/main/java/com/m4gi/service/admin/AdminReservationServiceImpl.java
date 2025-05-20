package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationListDTO;
import com.m4gi.mapper.admin.AdminReservationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminReservationServiceImpl implements AdminReservationService {

    private final AdminReservationMapper reservationMapper;

    @Override
    public List<AdminReservationListDTO> findAllReservations() {
        return reservationMapper.findAllReservations();
    }

    @Override
    public AdminReservationDetailDTO findReservationById(String reservationId) {
        return reservationMapper.findReservationById(reservationId);
    }
}
