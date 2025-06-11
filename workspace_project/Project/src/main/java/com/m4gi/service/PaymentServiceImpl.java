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
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

        /* 1️⃣  예약 ID 결정 */
        boolean isNewReservation = (reservation.getReservationId() == null || reservation.getReservationId().isBlank());
        if (isNewReservation) {
            reservation.setReservationId(generateRandomReservationId());
        }
        String reservationId = reservation.getReservationId();

        /* 2️⃣  사이트·날짜 겹침 검사 (신규 예약일 때만) */
        if (isNewReservation) {
            Map<String, Object> param = new HashMap<>();
            param.put("siteId",    reservation.getReservationSite());
            param.put("startDate", reservation.getReservationDate());
            param.put("endDate",   reservation.getEndDate());

            if (reservationMapper.existsReservationConflict(param)) {
                throw new IllegalStateException("이미 해당 사이트에 예약된 날짜입니다.");
            }
        }

        /* 3️⃣  이미 결제된 예약인지 검사 */
        if (paymentMapper.existsByReservationId(reservationId)) {
            throw new IllegalStateException("이미 결제된 예약입니다.");
        }

        /* 4️⃣  DB 저장 */
        // 4-1. 새 예약일 때만 insertReservation
        if (isNewReservation) {
            reservationMapper.insertReservation(reservation);
        }

        // 4-2. 결제 저장
        paymentDTO.setReservationId(reservationId);
        paymentDTO.setPaymentId(paymentMapper.getLastPaymentId());      // 새 결제 ID
        paymentDTO.setPaidAt(ZonedDateTime                       // 한국 시간으로 paid_at
                .now(ZoneId.of("Asia/Seoul"))
                .toLocalDateTime());
        paymentMapper.insertPayment(paymentDTO);

        /* 로그 */
        System.out.printf("💾 저장 완료  | reservationId=%s, paymentId=%s%n",
                reservationId, paymentDTO.getPaymentId());
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
