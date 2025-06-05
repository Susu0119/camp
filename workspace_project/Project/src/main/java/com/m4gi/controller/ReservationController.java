package com.m4gi.controller;

import com.m4gi.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/disabled-dates")
    public ResponseEntity<List<String>> getFullyBookedDates(@RequestParam String campgroundId) {
        List<LocalDate> dates = reservationService.getFullyBookedDates(campgroundId);
        List<String> result = dates.stream()
                .map(LocalDate::toString) // "2025-06-05"
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}

