package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminReservationDetailDTO;
import com.m4gi.dto.admin.AdminReservationDTO;
import com.m4gi.enums.RefundPolicy;
import com.m4gi.mapper.admin.AdminPaymentMapper;
import com.m4gi.mapper.admin.AdminReservationMapper;
import com.m4gi.util.KeywordNormalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminReservationServiceImpl implements AdminReservationService {

    private final AdminReservationMapper reservationMapper;
    private final AdminPaymentMapper paymentMapper;

    private static final int STATUS_CANCELLED = 2;
    private static final int REFUND_PENDING = 1;
    private static final int REFUND_APPROVED = 2;
    private static final int REFUND_REJECTED = 3;

    @Override
    public List<AdminReservationDTO> findAllReservations() {
        return reservationMapper.findAllReservations();
    }

    @Override
    public AdminReservationDetailDTO findReservationById(String reservationId) {
        return reservationMapper.findReservationById(reservationId);
    }

    @Override
    public Map<String, Object> cancelReservation(String reservationId, String reason) {
        AdminReservationDetailDTO reservation = reservationMapper.findReservationById(reservationId);
        if (reservation == null) throw new IllegalArgumentException("예약 정보 없음");

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
        if (reservation == null) throw new IllegalArgumentException("예약 정보 없음");

        if (reservation.getRefundStatus() == null || reservation.getRefundStatus() != REFUND_PENDING) {
            throw new IllegalStateException("현재 상태에서는 환불 처리를 할 수 없습니다!(현재값: " + reservation.getRefundStatus() + ")");
        }

        // 여기서 한번에 처리되도록 통일
        updateRefundAndPaymentStatus(reservationId, action);
    }

    @Override
    public List<AdminReservationDTO> searchReservations(String name, Integer reservationStatus, Integer refundStatus, String checkinDate, String sortOrder, String startDate, String endDate, Integer checkinStatus) {
        return reservationMapper.searchReservations(name, reservationStatus, refundStatus, checkinDate, sortOrder, startDate, endDate, checkinStatus);
    }

    @Transactional
    public void updateRefundAndPaymentStatus(String reservationId, String action) {
        int refundStatus;
        int paymentStatus;
        int refundType = 1; // 수동환불 처리(1)

        // 모든 가능성 허용 (영문 + 한글)
        if ("APPROVE".equalsIgnoreCase(action) || "환불완료".equals(action)) {
            refundStatus = REFUND_APPROVED;
            paymentStatus = 2; // 승인됨
        } else if ("REJECT".equalsIgnoreCase(action) || "환불거부".equals(action)) {
            refundStatus = REFUND_REJECTED;
            paymentStatus = 3; // 승인거절됨
        } else {
            throw new IllegalArgumentException("유효하지 않은 요청입니다. (지원하지 않는 상태)");
        }
        reservationMapper.updateRefundStatusWithType(
                reservationId,
                refundStatus,
                LocalDateTime.now(),
                refundType // 수동 처리 기록
        );

        paymentMapper.updatePaymentStatus(
                reservationId,
                paymentStatus
        );
    }
}
