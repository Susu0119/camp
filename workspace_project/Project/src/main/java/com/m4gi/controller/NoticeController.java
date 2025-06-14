package com.m4gi.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationAlertDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.service.NoticeService;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {
	@Autowired
	private NoticeService noticeService;

	@GetMapping
	public ResponseEntity<Map<String, List<NoticeDTO>>> getNotices() {
		List<NoticeDTO> today = noticeService.getTodayNotices();
		List<NoticeDTO> weekly = noticeService.getWeeklyNotices();

		Map<String, List<NoticeDTO>> result = new HashMap<>();
		result.put("today", today);
		result.put("weekly", weekly);
		return ResponseEntity.ok(result);
	}

	@GetMapping("/alerts")
	public ResponseEntity<List<ReservationAlertDTO>> getReservationAlerts(HttpSession session) {
		UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
		if (loginUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		int providerCode = loginUser.getProviderCode();
		String providerUserId = loginUser.getProviderUserId();

		List<ReservationAlertDTO> alerts = noticeService.getReservationAlerts(providerCode, providerUserId);

		return ResponseEntity.ok(alerts);
	}

	@GetMapping("/user/alerts")
	public ResponseEntity<List<NoticeDTO>> getUserNotices(HttpSession session) {
	    UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
	    if (loginUser == null) {
	        // 401 응답 시에도 캐싱 헤더를 추가하여 불필요한 캐싱 방지
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .header("Cache-Control", "no-cache, no-store, must-revalidate")
	                .header("Pragma", "no-cache")
	                .header("Expires", "0")
	                .build();
	    }

	    int providerCode = loginUser.getProviderCode();
	    String providerUserId = loginUser.getProviderUserId();

	    List<NoticeDTO> notices = noticeService.getNoticesByUser(providerCode, providerUserId);

	    // 200 OK 응답 시에도 캐싱 헤더를 추가하여 불필요한 캐싱 방지
	    return ResponseEntity.ok()
	            .header("Cache-Control", "no-cache, no-store, must-revalidate")
	            .header("Pragma", "no-cache")
	            .header("Expires", "0")
	            .body(notices);
	}
}
