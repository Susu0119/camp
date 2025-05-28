package com.m4gi.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.ReservationForReviewDTO;
import com.m4gi.dto.ReviewDTO;
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
    public ResponseEntity<List<ReservationForReviewDTO>> getAvailableReservationsForReview(
            @RequestParam("providerCode") int providerCode,
            @RequestParam("providerUserId") String providerUserId) {

        List<ReservationForReviewDTO> reservations = reviewService.getAvailableReservationsForReview(providerCode, providerUserId);

        return ResponseEntity.ok(reservations); // 200 OK
    }

    /**
     * 2. 리뷰 작성 API (멀티파트 이미지 업로드 지원)
     * POST /api/reviews/write
     * Content-Type: multipart/form-data
     */
    @PostMapping(value = "/write", consumes = "multipart/form-data", produces = "text/plain; charset=UTF-8")
    public ResponseEntity<String> writeReview(
            @RequestParam("reviewContent") String reviewContent,
            @RequestParam("reviewRating") int reviewRating,
            @RequestParam("reservationId") String reservationId,
            @RequestParam(value = "reviewPhotos", required = false) List<MultipartFile> reviewPhotos,
            @SessionAttribute("loginUser") UserDTO loginUser 
    		) {
        try {
            ReviewDTO reviewDTO = new ReviewDTO();
            reviewDTO.setReviewContent(reviewContent);
            reviewDTO.setReviewRating(reviewRating);
            reviewDTO.setReservationId(reservationId);

            // 이미지 파일 저장 및 파일명 리스트 생성
            if (reviewPhotos != null && !reviewPhotos.isEmpty()) {
                List<String> savedFileNames = new ArrayList<>();
                for (MultipartFile file : reviewPhotos) {
                    if (!file.isEmpty()) {
                        // UUID + 원본파일명으로 저장명 생성
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        // 서버에 저장할 경로 (실제 운영 환경에 맞게 조정 필요)
                        Path savePath = Paths.get("C:/upload/reviews/" + fileName);

                        // 디렉토리 없으면 생성
                        if (!Files.exists(savePath.getParent())) {
                            Files.createDirectories(savePath.getParent());
                        }

                        // 파일 저장
                        Files.write(savePath, file.getBytes());

                        savedFileNames.add(fileName);
                    }
                }

                // 파일명 리스트를 JSON 문자열로 변환하여 DTO에 저장
                ObjectMapper mapper = new ObjectMapper();
                String photosJson = mapper.writeValueAsString(savedFileNames);
                reviewDTO.setReviewPhotosJson(photosJson);
            }

            boolean result = reviewService.writeReview(reviewDTO);

            if (result) {
                return ResponseEntity.ok("리뷰가 성공적으로 등록되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("리뷰 등록에 실패했습니다.");
            }

        } catch (IllegalStateException e) {
            // 예약에 대한 리뷰 중복 시 처리
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (DuplicateKeyException e) {
            // reviewId 중복 시 처리
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 중 오류가 발생했습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    /**
     * 3. 전체 유저 리뷰 불러오기 (초기 진입용)
     */
    @GetMapping("/public/list")
    @ResponseBody
    public List<ReviewDTO> getRecentPublicReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return reviewService.getRecentPublicReviews(page, size);
    }

    /**
     * 4. 로그인한 사용자의 리뷰만 필터링하여 불러오기
     */
    @GetMapping("/my/filtered")
    public List<ReviewDTO> getMyFilteredReviews(
            @SessionAttribute("loginUser") UserDTO loginUser,
            @RequestParam String campgroundId,
            @RequestParam String checkInTime,
            @RequestParam String checkOutTime) {

        return reviewService.getReviewsByUserAndFilter(
                loginUser.getProviderUserId(),
                campgroundId,
                LocalDateTime.parse(checkInTime),
                LocalDateTime.parse(checkOutTime)
        );
    }
}
