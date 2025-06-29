package com.m4gi.controller.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationDTO;
import com.m4gi.service.admin.AdminReservationService;
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
    public ResponseEntity<List<AdminReservationDTO>> getReservationList() {
        List<AdminReservationDTO> list = reservationService.findAllReservations();
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
            @RequestBody Map<String, String> payload) {
        String cancelReason = payload.get("cancelReason");
        String customReason = payload.get("customReason"); // payload에서 customReason 추출
        Map<String, Object> result = reservationService.cancelReservation(reservationId, cancelReason, customReason); // 서비스 메서드 호출 시 customReason 추가
              return ResponseEntity.ok(result); // 컨트롤러가 아니라 서비스에서 받아와야 함
    }

    @PostMapping("/{reservationId}/refund")
    public ResponseEntity<Map<String, String>> handleRefundAction(
            @PathVariable String reservationId,
            @RequestBody Map<String, String> payload) {
        String action = payload.get("action");
        reservationService.processRefundAction(reservationId, action);
        return ResponseEntity.ok(Map.of("message", "처리완료"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AdminReservationDTO>> searchReservations( // 최근순/오래된 순 정렬 가능하게 해줌, 아무 옵션 없어도 ok
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer reservationStatus,
            @RequestParam(required = false) Integer refundStatus,
            @RequestParam(required = false) String checkinDate,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Integer checkinStatus

    ) {
        List<AdminReservationDTO> filtered = reservationService.searchReservations(
                name, reservationStatus, refundStatus, checkinDate, sortOrder, startDate, endDate, checkinStatus);
        return ResponseEntity.ok(filtered);
    }

}
