package com.m4gi.service;

import com.m4gi.dto.ReservationDTO;
import com.m4gi.mapper.ReservationMapper;
import com.m4gi.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationMapper reservationMapper;



    // ReservationServiceImpl.java
    @Override
    public List<ReservationDTO> getReservationsByProvider(Integer providerCode, String providerUserId) {
        return reservationMapper.findByProvider(providerCode, providerUserId);
    }

}
