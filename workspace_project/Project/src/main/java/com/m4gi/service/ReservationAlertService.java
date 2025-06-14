package com.m4gi.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.m4gi.mapper.ReservationAlertMapper;
import com.m4gi.dto.ReservationAlertDTO; 

@Service
public class ReservationAlertService {
	
	 @Autowired
	    private ReservationAlertMapper reservationAlertMapper;

	    public List<ReservationAlertDTO> getReservationAlertsForUser(Integer providerCode, String providerUserId) {
	        List<ReservationAlertDTO> allReservationAlerts = new ArrayList<>();

	        // 1. 예약 완료 알림 동적 생성
	        List<Map<String, Object>> completedReservations = reservationAlertMapper.selectCompletedReservationsForAlerts(providerCode, providerUserId);
	        for (Map<String, Object> reservation : completedReservations) {
	            ReservationAlertDTO alert = new ReservationAlertDTO();
	            alert.setAlertId((String) reservation.get("reservation_id")); // 예약 ID를 알림 ID로 사용
	            alert.setReservationId((String) reservation.get("reservation_id"));
	            String campgroundName = (String) reservation.get("campground_name");
	            String reservationId = (String) reservation.get("reservation_id");

	            alert.setAlertTitle("캠핑장 예약 완료 🎉");
	            alert.setAlertContent("'" + campgroundName + "' 예약 (예약번호: " + reservationId + ")이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!");

	            // DB에서 가져온 Timestamp를 LocalDateTime으로 변환
	            Timestamp createdAtTimestamp = (Timestamp) reservation.get("reservation_created_at");
	            if (createdAtTimestamp != null) {
	                alert.setCreatedAt(createdAtTimestamp.toLocalDateTime());
	            }

	            alert.setProviderCode(providerCode);
	            alert.setProviderUserId(providerUserId);
	            alert.setCampgroundName(campgroundName); // DTO에 캠핑장 이름 저장
	            allReservationAlerts.add(alert);
	        }

	        // 2. 예약 취소 알림 동적 생성
	        List<Map<String, Object>> canceledReservations = reservationAlertMapper.selectCanceledReservationsForAlerts(providerCode, providerUserId);
	        for (Map<String, Object> reservation : canceledReservations) {
	            ReservationAlertDTO alert = new ReservationAlertDTO();
	            alert.setAlertId((String) reservation.get("reservation_id")); // 예약 ID를 알림 ID로 사용
	            alert.setReservationId((String) reservation.get("reservation_id"));
	            String campgroundName = (String) reservation.get("campground_name");
	            String reservationId = (String) reservation.get("reservation_id");

	            alert.setAlertTitle("캠핑장 예약 취소 안내 😢");
	            alert.setAlertContent("'" + campgroundName + "' 예약 (예약번호: " + reservationId + ")이 취소되었습니다. 궁금한 점은 고객센터로 문의해주세요.");

	            // DB에서 가져온 Timestamp를 LocalDateTime으로 변환
	            Timestamp updatedAtTimestamp = (Timestamp) reservation.get("reservation_updated_at");
	            if (updatedAtTimestamp != null) {
	                alert.setCreatedAt(updatedAtTimestamp.toLocalDateTime()); // 취소 시점 사용
	            }

	            alert.setProviderCode(providerCode);
	            alert.setProviderUserId(providerUserId);
	            alert.setCampgroundName(campgroundName); // DTO에 캠핑장 이름 저장
	            allReservationAlerts.add(alert);
	        }

	        // 생성 시간 기준으로 최신순 정렬
	        allReservationAlerts.sort(Comparator.comparing(ReservationAlertDTO::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));

	        return allReservationAlerts;
	    }

}
