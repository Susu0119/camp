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

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentMapper paymentMapper;

    @Autowired
    private ReservationMapper reservationMapper;

    @Autowired
    private CampgroundMapper campgroundMapper;

    // 랜덤 문자열 생성을 위한 문자 집합 (소문자 + 대문자)
    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final SecureRandom random = new SecureRandom();

    /**
     * 소문자 + 대문자 조합으로 50자 랜덤 문자열 생성 (접두사 없음)
     */
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

        // 예약 ID 생성 (순수 50자 랜덤 문자열)
        String reservationId = generateRandomReservationId();
        reservation.setReservationId(reservationId);

        // 결제 ID 생성
        String paymentId = paymentMapper.getLastPaymentId();
        paymentDTO.setPaymentId(paymentId);
        paymentDTO.setReservationId(reservationId);

        // 저장
        reservationMapper.insertReservation(reservation);
        paymentMapper.insertPayment(paymentDTO);

        // 🔍 저장 확인 로그
        System.out.println("💾 예약 저장 완료:");
        System.out.println("   - 예약 ID: " + reservation.getReservationId());
        System.out.println("   - 사이트: " + reservation.getReservationSite());
        System.out.println("   - 날짜: " + reservation.getReservationDate() + " ~ " + reservation.getEndDate());
        System.out.println("   - 상태: " + reservation.getReservationStatus());
    }

    @Override
    public boolean validateAvailableSpots(int zoneId, String startDate, String endDate) {
        try {
            System.out.println("🔍 [검증] 구역: " + zoneId + ", 날짜: " + startDate + " ~ " + endDate);

            // 1. 구역 ID로 캠핑장 ID 찾기 (실제 DB 조회)
            Integer campgroundId = campgroundMapper.selectCampgroundIdByZoneId(zoneId);
            if (campgroundId == null) {
                System.out.println("❌ 구역 ID " + zoneId + "에 해당하는 캠핑장을 찾을 수 없습니다.");
                return false;
            }
            System.out.println("🏕️ 캠핑장 ID: " + campgroundId);

            // 2. 해당 구역의 남은 자리 계산
            List<Map<String, Object>> availableSites = campgroundMapper.selectAvailableZoneSites(
                    campgroundId, startDate, endDate);

            System.out.println("📊 전체 구역 남은 자리 결과: " + availableSites.size() + "개 구역");
            for (Map<String, Object> site : availableSites) {
                Integer siteZoneId = ((Number) site.get("zone_id")).intValue();
                Integer availableCount = ((Number) site.get("available_sites")).intValue();
                System.out.println("   구역 " + siteZoneId + ": " + availableCount + "자리");
            }

            // 3. 해당 구역의 남은 자리 확인
            for (Map<String, Object> site : availableSites) {
                Integer siteZoneId = ((Number) site.get("zone_id")).intValue();
                if (siteZoneId == zoneId) {
                    Integer availableCount = ((Number) site.get("available_sites")).intValue();
                    System.out.println("🔍 구역 " + zoneId + " 남은 자리: " + availableCount);
                    return availableCount > 0; // 0보다 크면 예약 가능
                }
            }

            // 해당 구역을 찾지 못했거나 남은 자리가 0개인 경우
            System.out.println("❌ 구역 " + zoneId + " 남은 자리 없음 또는 구역 정보 없음");
            return false;

        } catch (Exception e) {
            // 검증 과정에서 오류 발생 시 안전하게 false 반환
            System.out.println("❌ 남은 자리 검증 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
	 	// 중복 결제 조회
	    @Override
	    public boolean existsByReservationId(String reservationId) {
	        return paymentMapper.existsByReservationId(reservationId);
	    }

    /**
     * 사이트 ID로 구역 ID를 찾는 헬퍼 메서드 (실제 DB 조회)
     */
    public Integer getZoneIdBySiteId(String siteId) {
        try {
            return campgroundMapper.selectZoneIdBySiteId(siteId);
        } catch (Exception e) {
            System.out.println("❌ 사이트 ID " + siteId + "로 구역 ID 조회 실패: " + e.getMessage());
            return null;
        }
    }
}
