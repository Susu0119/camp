package com.m4gi.service;

import com.m4gi.dto.ReservationDTO;
import com.m4gi.mapper.ReservationMapper;
import com.m4gi.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationMapper reservationMapper;

    
    @Override
    @Transactional
    public void createReservation(ReservationDTO dto) {
        reservationMapper.insert(dto);
        
    }
}
