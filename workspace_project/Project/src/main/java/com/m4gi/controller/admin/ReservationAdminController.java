package com.m4gi.controller.admin;

import com.m4gi.dto.admin.ReservationDetailDTO;
import com.m4gi.dto.admin.ReservationListDTO;
import com.m4gi.service.admin.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/reservations")
@RequiredArgsConstructor
public class ReservationAdminController {
    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<ReservationListDTO>> getReservationList() {
        List<ReservationListDTO> list = reservationService.findAllReservations();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationDetailDTO> getReservationDetail(@PathVariable String reservationId) {
        ReservationDetailDTO dto = reservationService.findReservationById(reservationId);
        return ResponseEntity.ok(dto);
    }

}
