package com.m4gi.service;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.PaymentDTO;
import com.m4gi.dto.ReservationDTO;
import com.m4gi.dto.UserDTO; // UserDTO 임포트 추가
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
    // --- UserDTO currentUser 파라미터 추가 ---
    public void savePaymentAndReservation(PaymentDTO paymentDTO, UserDTO currentUser) {
        ReservationDTO reservation = paymentDTO.getReservation();

        /* 1️⃣ 예약 ID 결정 */
        boolean isNewReservation = (reservation.getReservationId() == null || reservation.getReservationId().isBlank());
        if (isNewReservation) {
            reservation.setReservationId(generateRandomReservationId());
        }
        String reservationId = reservation.getReservationId();

        /* 2️⃣ 사이트·날짜 겹침 검사 (신규 예약일 때만) */
        if (isNewReservation) {
            Map<String, Object> param = new HashMap<>();
            param.put("siteId",    reservation.getReservationSite());
            param.put("startDate", reservation.getReservationDate());
            param.put("endDate",   reservation.getEndDate());

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
        }

        // 4-2. 결제 저장
        paymentDTO.setReservationId(reservationId);
        // paymentMapper.getLastPaymentId()는 실제로는 DB 시퀀스 또는 AUTO_INCREMENT로 생성되어야 합니다.
        // 이 부분은 팀의 Mapper 구현 방식에 따라 적절히 수정해야 합니다.
        // 현재는 DB에서 Payment ID를 생성하는 방식이 아닐 수 있으므로 getLastPaymentId() 호출.
        paymentDTO.setPaymentId(paymentMapper.getLastPaymentId());
        paymentDTO.setPaidAt(ZonedDateTime
                .now(ZoneId.of("Asia/Seoul"))
                .toLocalDateTime());
        paymentMapper.insertPayment(paymentDTO);

        /* 로그 */
        System.out.printf("💾 저장 완료 | reservationId=%s, paymentId=%s%n",
                reservationId, paymentDTO.getPaymentId());

        // --- 🎉 예약 완료 알림 생성 및 삽입 🎉 ---
        // 결제와 예약이 모두 성공적으로 DB에 저장된 후 알림을 생성합니다.
        try {
        	// ✅ campgroundName을 백엔드에서 직접 조회
            String campgroundName = "캠핑장"; // 기본값
            if (reservation.getReservationSite() != null) {
                // ReservationMapper나 CampgroundMapper를 통해 캠핑장 이름을 조회하는 메서드가 필요합니다.
                // 예를 들어, campgroundMapper에 siteId로 캠핑장 이름을 조회하는 메서드를 추가한다고 가정합니다.
                // 예: CampgroundDTO campgroundInfo = campgroundMapper.getCampgroundNameBySiteId(reservation.getReservationSite());
                // 현재 campgroundMapper에 `selectCampgroundIdByZoneId`는 있지만 이름은 없으니 추가해야 합니다.
                // 지금은 일단 `CampgroundMapper.getCampgroundNameBySiteId`라는 가상의 메서드를 사용합니다.
                String fetchedCampgroundName = campgroundMapper.getCampgroundNameBySiteId(reservation.getReservationSite());
                if (fetchedCampgroundName != null && !fetchedCampgroundName.isBlank()) {
                    campgroundName = fetchedCampgroundName;
                }
            }    	       	        	
            NoticeDTO notice = new NoticeDTO();
            notice.setNoticeTitle("캠핑장 예약 완료 🎉");
            // ✅ 알림 내용에서 '캠핑장' 대신 조회된 이름 사용, 예약번호 제거
            notice.setNoticeContent(
                String.format("'%s' 예약이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!",
                              campgroundName) // reservationId 제거
            );
            
            notice.setProviderCode(currentUser.getProviderCode());
            notice.setProviderUserId(currentUser.getProviderUserId());
            // notice.setReservationId(reservationId); // 만약 notice 테이블에 reservation_id를 추가했다면 이 라인 추가

            noticeService.addNotice(notice);
            System.out.println("[알림] 예약 완료 알림이 성공적으로 생성되었습니다.");

        } catch (Exception e) {
            // 알림 생성 실패가 전체 결제/예약 실패로 이어지지 않도록 예외를 로깅만 하고 넘어갑니다.
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