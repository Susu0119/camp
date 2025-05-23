package com.m4gi.controller.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationListDTO;
import com.m4gi.service.admin.AdminReservationService;
import com.m4gi.util.KeywordNormalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PostMapping("/{reservationId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelReservation(
            @PathVariable String reservationId,
            @RequestBody Map<String, String> payload
    ) {
        String reason = payload.get("reason");
        Map<String, Object> result = reservationService.cancelReservation(reservationId, reason);
        return ResponseEntity.ok(result); // 컨트롤러가 아니라 서비스에서 받아와야 함
    }

    @PostMapping("/{reservationId}/refund")
    public ResponseEntity<Map<String, String>> handleRefundAction(
            @PathVariable String reservationId,
            @RequestBody Map<String, String> payload
    ) {
        String action = payload.get("action");
        reservationService.processRefundAction(reservationId, action);
        return ResponseEntity.ok(Map.of("message", "환불처리 완료"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AdminReservationListDTO>> searchReservations(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer reservationStatus,
            @RequestParam(required = false) Integer refundStatus,
            @RequestParam(required = false) String checkinDate,
            @RequestParam(defaultValue = "desc") String sortOrder // 🔥 이거 추가
    ) {
        List<AdminReservationListDTO> filtered = reservationService.searchReservations(
                name, reservationStatus, refundStatus, checkinDate, sortOrder
        );
        return ResponseEntity.ok(filtered);
    }

}
