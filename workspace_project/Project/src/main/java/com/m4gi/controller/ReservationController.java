package com.m4gi.controller;

import com.m4gi.dto.ReservationDTO;
import com.m4gi.mapper.ReservationMapper;
import com.m4gi.service.ReservationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationDTO> create(@RequestBody ReservationDTO dto) {
        reservationService.createReservation(dto);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }
}