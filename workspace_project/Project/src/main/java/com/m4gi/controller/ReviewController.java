package com.m4gi.controller;

import com.google.type.DateTime;
import com.m4gi.dto.ReservationForReviewDTO;
import com.m4gi.dto.ReviewDTO;
import com.m4gi.service.ReviewService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 1. 리뷰 작성 가능한 예약 목록 조회
     */
    @GetMapping("/available")
    public ResponseEntity<List<ReservationForReviewDTO>> getAvailableReservationsForReview(
            @RequestParam("providerCode") int providerCode,
            @RequestParam("providerUserId") String providerUserId) {

        List<ReservationForReviewDTO> reservations = reviewService.getAvailableReservationsForReview(providerCode, providerUserId);

        if (reservations.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }

        return ResponseEntity.ok(reservations); // 200 OK
    }

    /**
     * 2. 리뷰 작성 API
     * 예: POST /api/reviews/write
     * 요청 body: JSON 형식 ReviewDTO
     */
    @PostMapping("/write")
    public ResponseEntity<String> writeReview(@RequestBody ReviewDTO reviewDTO) {
        try {
            boolean result = reviewService.writeReview(reviewDTO);
            if (result) {
                return ResponseEntity.ok("리뷰가 성공적으로 등록되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("리뷰 등록에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }
    
    /**
     * 3. 조건별 리뷰 상세 조회
     */
    @GetMapping("/reviews/search")
    public ResponseEntity<?> searchReviews(
            @RequestParam String campgroundId,
            @RequestParam String checkInTime,
            @RequestParam String checkOutTime) {

        LocalDateTime start = LocalDateTime.parse(checkInTime);
        LocalDateTime end = LocalDateTime.parse(checkOutTime);

        List<ReviewDTO> reviews = reviewService.getReviewsByDateAndCampground(campgroundId, start, end);

        if (reviews.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(reviews);
    }

    
}
