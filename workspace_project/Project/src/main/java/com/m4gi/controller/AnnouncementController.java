package com.m4gi.controller;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    /** 오늘 + 이번주 공지를 한 번에 반환 */
    @GetMapping
    public ResponseEntity<Map<String, List<NoticeDTO>>> getAnnouncements() {
        List<NoticeDTO> today = announcementService.getTodayAnnouncements();
        List<NoticeDTO> weekly = announcementService.getWeeklyAnnouncements();

        Map<String, List<NoticeDTO>> result = new HashMap<>();
        result.put("today", today);
        result.put("weekly", weekly);

        return ResponseEntity.ok(result);
    }

    /** 특정 사용자 공지 */
    @GetMapping("/user")
    public ResponseEntity<List<NoticeDTO>> getUserAnnouncements(
            @RequestParam int providerCode,
            @RequestParam String providerUserId) {
        return ResponseEntity.ok(
                announcementService.getAnnouncementsByUser(providerCode, providerUserId)
        );
    }

    /** 검색·페이징 목록 */
    @GetMapping("/page")
    public Map<String, Object> page(@RequestParam(defaultValue = "1") int page,
                                    @RequestParam(defaultValue = "10") int size,
                                    @RequestParam(required = false) String keyword,
                                    @RequestParam(required = false) String startDate,
                                    @RequestParam(required = false) String endDate) {
        Map<String, Object> res = new HashMap<>();
        res.put("announcements", announcementService.searchAnnouncements(keyword, startDate, endDate, page, size));
        res.put("totalCount", announcementService.countAnnouncements(keyword, startDate, endDate));
        return res;
    }

    /** 상세 조회 */
    @GetMapping("/{id}")
    public NoticeDTO detail(@PathVariable int id) {
        return announcementService.getAnnouncementDetail(id);
    }

    /** 공지 등록 */
    @PostMapping
    public ResponseEntity<Void> create(@RequestBody NoticeDTO dto) {
        announcementService.addAnnouncement(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /** 공지 수정 */
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody NoticeDTO dto) {
        dto.setNoticeId((long) id);
        announcementService.updateAnnouncement(dto);
        return ResponseEntity.ok().build();
    }

    /** 공지 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }
}
