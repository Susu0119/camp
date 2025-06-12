package com.m4gi.controller;

import java.time.LocalDateTime;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.m4gi.dto.ReservationForReviewDTO;
import com.m4gi.dto.ReviewDTO;
import com.m4gi.dto.ReviewReportRequestDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 1. 리뷰 작성 가능한 예약 목록 조회
     */
    @GetMapping("/available")
    public ResponseEntity<List<ReservationForReviewDTO>> getAvailableReservationsForReview(HttpSession session) {
        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        if (providerCode == null || providerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ReservationForReviewDTO> reservations = reviewService.getAvailableReservationsForReview(providerCode,
                providerUserId);
        return ResponseEntity.ok(reservations);
    }

    /**
     * 2. 리뷰 작성 API (멀티파트 이미지 업로드 지원)
     */
    @PostMapping(value = "/write", produces = "text/plain; charset=UTF-8")
    public ResponseEntity<String> writeReview(
            @RequestParam("campgroundId") int campgroundId,
            @RequestParam("reviewContent") String reviewContent,
            @RequestParam("reviewRating") double reviewRating,
            @RequestParam("reservationId") String reservationId,
            @RequestParam(value = "photoUrlsJson", required = false) String photoUrlsJson,
            HttpSession session) {

        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");

        if (providerCode == null || providerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            ReviewDTO reviewDTO = new ReviewDTO();
            reviewDTO.setCampgroundId(campgroundId);
            reviewDTO.setReviewContent(reviewContent);
            reviewDTO.setReviewRating(reviewRating);
            reviewDTO.setReservationId(reservationId);
            reviewDTO.setProviderCode(providerCode);
            reviewDTO.setProviderUserId(providerUserId);

            if (photoUrlsJson != null && !photoUrlsJson.isEmpty() && !photoUrlsJson.contentEquals("[]")) {
                reviewDTO.setReviewPhotosJson(photoUrlsJson);
            } else {
                reviewDTO.setReviewPhotosJson("[]");
            }

            boolean result = reviewService.writeReview(reviewDTO);

            if (result) {
                return ResponseEntity.ok("리뷰가 성공적으로 등록되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("리뷰 등록에 실패했습니다.");
            }

        } catch (IllegalStateException | DuplicateKeyException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    /**
     * 3. 전체 유저 리뷰 불러오기 (초기 진입용)
     */
    @GetMapping("/public/list")
    public List<ReviewDTO> getRecentPublicReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return reviewService.getRecentPublicReviews(page, size);
    }

    /**
     * 4. 로그인한 사용자의 리뷰만 필터링하여 불러오기
     */
    @GetMapping("/my/filtered")
    public List<ReviewDTO> getMyFilteredReviews(
            @SessionAttribute("loginUser") UserDTO loginUser,
            @RequestParam int campgroundId,
            @RequestParam String checkInTime,
            @RequestParam String checkOutTime) {

        return reviewService.getReviewsByUserAndFilter(
                loginUser.getProviderUserId(),
                campgroundId,
                LocalDateTime.parse(checkInTime),
                LocalDateTime.parse(checkOutTime));
    }

    // 리뷰 상세 조회 API
    @GetMapping("/{reviewId}")
    public ReviewDTO getReviewDetail(@PathVariable("reviewId") String reviewId) {
        return reviewService.getReviewById(reviewId);
    }

    @PostMapping("/report")
    public ResponseEntity<String> reportReview(@RequestBody ReviewReportRequestDTO dto, HttpSession session) {
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            boolean success = reviewService.reportReview(dto, loginUser);
            if (success) {
                return ResponseEntity.ok("리뷰가 성공적으로 신고되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("리뷰 신고에 실패했습니다.");
            }
        } catch (DuplicateKeyException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 신고한 리뷰입니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("리뷰 신고 중 오류 발생: " + e.getMessage());
        }
    }
}
