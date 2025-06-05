package com.m4gi.service;

import com.m4gi.mapper.ReservationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationMapper reservationMapper;

    @Override
    public List<LocalDate> getFullyBookedDates(String campgroundId) {
        return reservationMapper.findFullyBookedDates(campgroundId);
    }
}

