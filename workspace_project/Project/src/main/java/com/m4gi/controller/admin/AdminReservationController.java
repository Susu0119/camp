package com.m4gi.controller.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationListDTO;
import com.m4gi.service.admin.AdminReservationService;
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
public class AdminReservationController {
    private final AdminReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<AdminReservationListDTO>> getReservationList() {
        List<AdminReservationListDTO> list = reservationService.findAllReservations();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<AdminReservationDetailDTO> getReservationDetail(@PathVariable String reservationId) {
        AdminReservationDetailDTO dto = reservationService.findReservationById(reservationId);
        return ResponseEntity.ok(dto);
    }

}
