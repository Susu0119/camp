package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationListDTO;
import com.m4gi.enums.RefundPolicy;
import com.m4gi.mapper.admin.AdminReservationMapper;
import com.m4gi.util.KeywordNormalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminReservationServiceImpl implements AdminReservationService {

    private final AdminReservationMapper reservationMapper;

    @Override
    public List<AdminReservationListDTO> findAllReservations() {
        return reservationMapper.findAllReservations();
    }

    @Override
    public AdminReservationDetailDTO findReservationById(String reservationId) {
        return reservationMapper.findReservationById(reservationId);
    }

    @Override
    public Map<String, Object> cancelReservation(String reservationId, String reason) {
        AdminReservationDetailDTO reservation = reservationMapper.findReservationById(reservationId);
        if (reservation == null) {
            throw new IllegalArgumentException("예약 정보 없음");
        }

        boolean isExceptional = KeywordNormalizer.isExceptional(reason);

        LocalDate now = LocalDate.now();
        LocalDate checkinDate = reservation.getCheckinDate();
        int daysBefore = (int) ChronoUnit.DAYS.between(now, checkinDate);

        double refundRate = RefundPolicy.getRefundRate(daysBefore, isExceptional);

        reservationMapper.updateCancellation(
                reservationId,
                "취소됨",
                reason,
                "환불대기", // DB에 저장은 안해도, 프론트에게 환불율을 알려주기 위해
                now
                // refundRate
        );

        return Map.of(
                "isExceptional", isExceptional,
                "refundRate", refundRate,
                "message", "예약 취소 처리됨"
        );
    }

    @Override
    public void processRefundAction(String reservationId, String action) {
        AdminReservationDetailDTO reservation = reservationMapper.findReservationById(reservationId);
        if (reservation == null) {
            throw new IllegalArgumentException("예약 정보 없음");
        }

        if (!"환불대기".equals(reservation.getRefundStatus())) {
            throw new IllegalStateException("현재 상태에서는 환불 처리를 할 수 없습니다!");
        }

        String newStatus;
        if ("APPROVE".equalsIgnoreCase(action)) {
            newStatus = "환불완료";
        } else if ("REJECT".equalsIgnoreCase(action)) {
            newStatus = "환불거부";
        } else {
            throw new IllegalArgumentException("유효하지 않은 요청 입니다.");
        }

        reservationMapper.updateRefundStatus(reservationId, newStatus, LocalDateTime.now());
    }
}
