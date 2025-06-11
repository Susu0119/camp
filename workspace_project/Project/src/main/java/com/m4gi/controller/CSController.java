package com.m4gi.controller;

import com.m4gi.dto.ReservationDTO;
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
    public ResponseEntity<List<ReservationDTO>> myReservations(HttpSession session) {
        Integer providerCode = (Integer) session.getAttribute("providerCode"); // ✅ 카멜케이스로 수정
        String providerUserId = (String) session.getAttribute("providerUserId");

        if (providerCode == null || providerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationDTO> list = reservationService.getReservationsByProvider(providerCode, providerUserId);
        return ResponseEntity.ok(list);
    }


}
