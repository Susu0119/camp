package com.m4gi.service;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.PaymentDTO;
import com.m4gi.dto.ReservationDTO;
import com.m4gi.dto.UserDTO;
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

    @Autowired
    private NoticeService noticeService; // NoticeService 주입

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
    public void savePaymentAndReservation(PaymentDTO paymentDTO, UserDTO currentUser) {
        ReservationDTO reservation = paymentDTO.getReservation();

        // 🚨 새로 추가된 로그: savePaymentAndReservation 메서드 시작 시 ReservationDTO 확인
        System.out.println("🚀 [PaymentServiceImpl] savePaymentAndReservation 시작!");
        if (reservation != null) {
            System.out.println("🚀 [PaymentServiceImpl] 수신된 ReservationDTO: " + reservation.toString());
            System.out.println("🚀 [PaymentServiceImpl] 수신된 campgroundName (ReservationDTO): " + reservation.getCampgroundName());
        } else {
            System.err.println("🚀 [PaymentServiceImpl] 수신된 ReservationDTO가 null입니다.");
        }
        // --------------------------------------------------------------------------

        /* 1️⃣ 예약 ID 결정 */
        boolean isNewReservation = (reservation.getReservationId() == null || reservation.getReservationId().isBlank());
        if (isNewReservation) {
            reservation.setReservationId(generateRandomReservationId());
        }
        String reservationId = reservation.getReservationId();

        /* 2️⃣ 사이트·날짜 겹침 검사 (신규 예약일 때만) */
        if (isNewReservation) {
            Map<String, Object> param = new HashMap<>();
            param.put("siteId", reservation.getReservationSite());
            param.put("startDate", reservation.getReservationDate());
            param.put("endDate", reservation.getEndDate());

            if (reservationMapper.existsReservationConflict(param)) {
                throw new IllegalStateException("이미 해당 사이트에 예약된 날짜입니다.");
            }
        }

        /* 3️⃣ 이미 결제된 예약인지 검사 */
        if (paymentMapper.existsByReservationId(reservationId)) {
            throw new IllegalStateException("이미 결제된 예약입니다.");
        }

        /* 4️⃣ DB 저장 */
        // 4-1. 새 예약일 때만 insertReservation
        if (isNewReservation) {
            reservationMapper.insertReservation(reservation);
            // 🚨 새로 추가된 로그: 예약 정보 DB 저장 후 확인
            System.out.println("✅ [PaymentServiceImpl] Reservation DB 저장 완료: " + reservation.getReservationId());
        }

        // 4-2. 결제 저장
        paymentDTO.setReservationId(reservationId);
        paymentDTO.setPaymentId(paymentMapper.getLastPaymentId());
        paymentDTO.setPaidAt(ZonedDateTime
                .now(ZoneId.of("Asia/Seoul"))
                .toLocalDateTime());
        paymentMapper.insertPayment(paymentDTO);

        /* 로그 */
        System.out.printf("💾 저장 완료 | reservationId=%s, paymentId=%s%n",
                reservationId, paymentDTO.getPaymentId());

        System.out.println("🚀 [PaymentServiceImpl] 수신된 campgroundName (ReservationDTO): " + reservation.getCampgroundName());

        
        // --- 🎉 예약 완료 알림 생성 및 삽입 🎉 ---
        try {
            String campgroundName = reservation.getCampgroundName(); 
            
            if (campgroundName == null || campgroundName.isBlank()) {
                campgroundName = "예약된 캠핑장"; 
                System.err.println("⚠️ [PaymentServiceImpl] ReservationDTO에 campgroundName이 비어있습니다. 기본값을 사용합니다.");
            }

            NoticeDTO notice = new NoticeDTO();
            notice.setNoticeTitle("캠핑장 예약 완료 🎉");
            
            // ⭐️⭐️⭐️ 알림 메시지 내용 확인용 로그 추가! ⭐️⭐️⭐️
            String finalNoticeContent = String.format("'%s' 예약이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!", campgroundName);
            System.out.println("✨ [PaymentServiceImpl] 최종 알림 content 생성: " + finalNoticeContent);
            // ----------------------------------------------------

            notice.setNoticeContent(
                    String.format("'%s' 예약이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!",
                                  campgroundName) // 백엔드에서 이 campgroundName이 들어가야 합니다.
                );
            notice.setProviderCode(currentUser.getProviderCode());
            notice.setProviderUserId(currentUser.getProviderUserId());
            notice.setPublished(true);
            notice.setReservationId(null); 

            noticeService.addNotice(notice);
            System.out.println("[알림] 예약 완료 알림이 성공적으로 생성되었습니다.");

        } catch (Exception e) {
            System.err.println("[오류] 예약 완료 알림 생성 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
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

    @Override
    public boolean existsByReservationId(String reservationId) {
        return paymentMapper.existsByReservationId(reservationId);
    }

    public Integer getZoneIdBySiteId(String siteId) {
        try {
            return campgroundMapper.selectZoneIdBySiteId(siteId);
        } catch (Exception e) {
            System.out.println("❌ 사이트 ID " + siteId + "로 구역 ID 조회 실패: " + e.getMessage());
            return null;
        }
    }
}