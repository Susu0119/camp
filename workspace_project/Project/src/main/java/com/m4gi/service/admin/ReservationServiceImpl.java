package com.m4gi.service.admin;

import com.m4gi.dto.admin.ReservationDetailDTO;
import com.m4gi.dto.admin.ReservationListDTO;
import com.m4gi.mapper.admin.ReservationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService{

    private final ReservationMapper reservationMapper;

    @Override
    public List<ReservationListDTO> findAllReservations() {
        return reservationMapper.findAllReservations();
    }

    @Override
    public ReservationDetailDTO findReservationById(String reservationId) {
        return reservationMapper.findReservationById(reservationId);
    }
}
