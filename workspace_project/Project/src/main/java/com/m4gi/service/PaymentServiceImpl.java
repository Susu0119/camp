package com.m4gi.service;

import com.m4gi.dto.PaymentDTO;
import com.m4gi.dto.ReservationDTO;
import com.m4gi.mapper.PaymentMapper;
import com.m4gi.mapper.ReservationMapper;
import com.m4gi.mapper.CampgroundMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.ZonedDateTime;
import java.time.ZoneId;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentMapper paymentMapper;

    @Autowired
    private ReservationMapper reservationMapper;

    @Autowired
    private CampgroundMapper campgroundMapper;

    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final SecureRandom random = new SecureRandom();

    private String generateRandomReservationId() {
        StringBuilder sb = new StringBuilder(50);
        for (int i = 0; i < 50; i++) {
            int index = random.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }
        return sb.toString();
    }

    @Override
    @Transactional
    public void savePaymentAndReservation(PaymentDTO paymentDTO) {
        ReservationDTO reservation = paymentDTO.getReservation();

        // ✅ 기존 예약 ID가 존재하면 그대로 사용 (중복 결제 검사와 일치)
        String reservationId = reservation.getReservationId();
        if (reservationId == null || reservationId.isBlank()) {
            // 신규 예약이면 새로 생성
            reservationId = generateRandomReservationId();
            reservation.setReservationId(reservationId);
        }

        // ✅ 사이트+날짜 중복 체크 (결제 전에 반드시 검사)
        Map<String, Object> param = new HashMap<>();
        param.put("siteId", reservation.getReservationSite());
        param.put("startDate", reservation.getReservationDate());
        param.put("endDate", reservation.getEndDate());

        boolean conflict = reservationMapper.existsReservationConflict(param);
        if (conflict) {
            throw new IllegalStateException("이미 해당 사이트에 예약된 날짜입니다.");
        }

        // 결제 ID 생성
        String paymentId = paymentMapper.getLastPaymentId();
        paymentDTO.setPaymentId(paymentId);
        paymentDTO.setReservationId(reservationId);

        // paid_at을 KST 기준으로 설정
        ZonedDateTime nowKST = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        paymentDTO.setPaidAt(nowKST.toLocalDateTime());

        // 저장
        reservationMapper.insertReservation(reservation);
        paymentMapper.insertPayment(paymentDTO);

        // 로그 출력
        System.out.println("💾 예약 저장 완료:");
        System.out.println("   - 예약 ID: " + reservationId);
        System.out.println("   - 사이트: " + reservation.getReservationSite());
        System.out.println("   - 날짜: " + reservation.getReservationDate() + " ~ " + reservation.getEndDate());
        System.out.println("   - 상태: " + reservation.getReservationStatus());
    }

    @Override
    public boolean validateAvailableSpots(int zoneId, String startDate, String endDate) {
        try {
            System.out.println("🔍 [검증] 구역: " + zoneId + ", 날짜: " + startDate + " ~ " + endDate);
            Integer campgroundId = campgroundMapper.selectCampgroundIdByZoneId(zoneId);
            if (campgroundId == null) {
                System.out.println("❌ 구역 ID " + zoneId + "에 해당하는 캠핑장을 찾을 수 없습니다.");
                return false;
            }

            List<Map<String, Object>> availableSites = campgroundMapper.selectAvailableZoneSites(
                    campgroundId, startDate, endDate);

            System.out.println("📊 전체 구역 남은 자리 결과: " + availableSites.size() + "개 구역");
            for (Map<String, Object> site : availableSites) {
                Integer siteZoneId = ((Number) site.get("zone_id")).intValue();
                Integer availableCount = ((Number) site.get("available_sites")).intValue();
                System.out.println("   구역 " + siteZoneId + ": " + availableCount + "자리");
            }

            for (Map<String, Object> site : availableSites) {
                Integer siteZoneId = ((Number) site.get("zone_id")).intValue();
                if (siteZoneId == zoneId) {
                    Integer availableCount = ((Number) site.get("available_sites")).intValue();
                    System.out.println("🔍 구역 " + zoneId + " 남은 자리: " + availableCount);
                    return availableCount > 0;
                }
            }

            System.out.println("❌ 구역 " + zoneId + " 남은 자리 없음 또는 구역 정보 없음");
            return false;

        } catch (Exception e) {
            System.out.println("❌ 남은 자리 검증 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    // 중복 결제 확인용 메서드
    @Override
    public boolean existsByReservationId(String reservationId) {
        return paymentMapper.existsByReservationId(reservationId);
    }

    // 사이트 ID → 구역 ID 헬퍼
    public Integer getZoneIdBySiteId(String siteId) {
        try {
            return campgroundMapper.selectZoneIdBySiteId(siteId);
        } catch (Exception e) {
            System.out.println("❌ 사이트 ID " + siteId + "로 구역 ID 조회 실패: " + e.getMessage());
            return null;
        }
    }
}
