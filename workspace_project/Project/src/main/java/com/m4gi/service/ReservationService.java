package com.m4gi.service;

import java.time.LocalDate;
import java.util.List;

public interface ReservationService {
    List<LocalDate> getFullyBookedDates(String campgroundId);
}

