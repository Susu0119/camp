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

    private static final int STATUS_CANCELLED = 2; // 예: 2 = 취소됨
    private static final int REFUND_PENDING = 1;   // 예: 1 = 환불대기
    private static final int REFUND_APPROVED = 2;  // 예: 2 = 환불완료
    private static final int REFUND_REJECTED = 3;  // 예: 3 = 환불거부

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
        LocalDate checkinDate = reservation.getCheckinTime().toLocalDate();
        int daysBefore = (int) ChronoUnit.DAYS.between(now, checkinDate);

        double refundRate = RefundPolicy.getRefundRate(daysBefore, isExceptional);

        reservationMapper.updateCancellation(
                reservationId,
                STATUS_CANCELLED,
                reason,
                REFUND_PENDING,
                now
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

        if (reservation.getRefundStatus() == null || reservation.getRefundStatus() != REFUND_PENDING) {
            throw new IllegalStateException("현재 상태에서는 환불 처리를 할 수 없습니다!");
        }

        int newStatus;
        if ("APPROVE".equalsIgnoreCase(action)) {
            newStatus = REFUND_APPROVED;
        } else if ("REJECT".equalsIgnoreCase(action)) {
            newStatus = REFUND_REJECTED;
        } else {
            throw new IllegalArgumentException("유효하지 않은 요청 입니다.");
        }

        reservationMapper.updateRefundStatus(reservationId, newStatus, LocalDateTime.now());
    }
}