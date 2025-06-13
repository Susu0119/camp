package com.m4gi.controller;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationAlertDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

	@Autowired
	private NoticeService noticeService;

	/* ==========  기존 엔드포인트 유지 ========== */

	/** 오늘 + 이번주 공지를 한 번에 반환 */
	@GetMapping
	public ResponseEntity<Map<String, List<NoticeDTO>>> getNotices() {
		List<NoticeDTO> today   = noticeService.getTodayNotices();
		List<NoticeDTO> weekly  = noticeService.getWeeklyNotices();

		Map<String, List<NoticeDTO>> result = new HashMap<>();
		result.put("today", today);
		result.put("weekly", weekly);

		return ResponseEntity.ok(result);
	}

	/** 예약 알림 (세션 필요) */
	@GetMapping("/alerts")
	public ResponseEntity<List<ReservationAlertDTO>> getReservationAlerts(HttpSession session) {
		UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
		if (loginUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		return ResponseEntity.ok(
				noticeService.getReservationAlerts(loginUser.getProviderCode(), loginUser.getProviderUserId())
		);
	}

	/** 특정 사용자 공지 */
	@GetMapping("/user/alerts")
	public ResponseEntity<List<NoticeDTO>> getUserNotices(HttpSession session) {
		UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
		if (loginUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.header("Cache-Control", "no-cache, no-store, must-revalidate")
					.header("Pragma", "no-cache")
					.header("Expires", "0")
					.build();
		}
		List<NoticeDTO> notices =
				noticeService.getNoticesByUser(loginUser.getProviderCode(), loginUser.getProviderUserId());

		return ResponseEntity.ok()
				.header("Cache-Control", "no-cache, no-store, must-revalidate")
				.header("Pragma", "no-cache")
				.header("Expires", "0")
				.body(notices);
	}

	/* ==========  신규 엔드포인트  ========== */

	/** 검색·페이징 목록 : /api/notices/page?page=1&size=10 ... */
	@GetMapping("/page")
	public Map<String, Object> page(@RequestParam(defaultValue = "1")  int page,
									@RequestParam(defaultValue = "10") int size,
									@RequestParam(required = false)   String keyword,
									@RequestParam(required = false)   String startDate,
									@RequestParam(required = false)   String endDate) {

		Map<String, Object> res = new HashMap<>();
		res.put("notices", noticeService.searchNotices(keyword, startDate, endDate, page, size));
		res.put("totalCount", noticeService.countNotices(keyword, startDate, endDate));
		return res;
	}

	/** 상세 조회 */
	@GetMapping("/{id}")
	public NoticeDTO detail(@PathVariable int id) {
		return noticeService.getNoticeDetail(id);
	}

	/** 공지 등록 */
	@PostMapping
	public ResponseEntity<Void> create(@RequestBody NoticeDTO dto) {
		noticeService.addNotice(dto);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	/** 공지 수정 */
	@PutMapping("/{id}")
	public ResponseEntity<Void> update(@PathVariable int id, @RequestBody NoticeDTO dto) {
		dto.setNoticeId((long) id);
		noticeService.updateNotice(dto);
		return ResponseEntity.ok().build();
	}

	/** 공지 삭제 */
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable int id) {
		noticeService.deleteNotice(id);
		return ResponseEntity.noContent().build();
	}
}
