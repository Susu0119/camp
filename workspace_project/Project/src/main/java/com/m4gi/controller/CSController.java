package com.m4gi.controller;

import com.m4gi.dto.ReservationDTO;
import com.m4gi.dto.ReservationSummaryDTO;
import com.m4gi.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api/cs")
public class CSController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationSummaryDTO>> myReservations(HttpSession session) {

        Integer providerCode   = (Integer) session.getAttribute("providerCode");
        String  providerUserId = (String) session.getAttribute("providerUserId");

        //log.debug("Session providerCode={}, providerUserId={}", providerCode, providerUserId);

        if (providerCode == null || providerUserId == null)
            return ResponseEntity.status(401).build();

        List<ReservationSummaryDTO> list =
                reservationService.getReservationSummariesByProvider(providerCode, providerUserId);

        return ResponseEntity.ok(list);
    }


}
