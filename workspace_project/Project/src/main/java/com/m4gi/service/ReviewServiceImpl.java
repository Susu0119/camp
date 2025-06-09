package com.m4gi.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.m4gi.dto.ReservationForReviewDTO;
import com.m4gi.dto.ReviewDTO;
import com.m4gi.mapper.ReviewMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;
    private final FileUploadService fileUploadService;

    // 예약 완료 상태를 상수로 선언
    private static final int RESERVATION_COMPLETED_STATUS = 3;

    // 1. 리뷰 가능한 예약 목록 조회
    @Override
    public List<ReservationForReviewDTO> getAvailableReservationsForReview(int providerCode, String providerUserId) {
        return reviewMapper.selectCompletedReservationsWithoutReview(providerCode, providerUserId,
                RESERVATION_COMPLETED_STATUS);
    }

    // 2. 리뷰 저장
    @Override
    public boolean writeReview(ReviewDTO review) {
        // reviewId 자동 생성
        if (review.getReviewId() == null || review.getReviewId().isEmpty()) {
            review.setReviewId("rev_" + UUID.randomUUID().toString().substring(0, 8));
        }

        // 중복 리뷰 체크 (reservationId 기준)
        if (reviewMapper.countByReservationId(review.getReservationId()) > 0) {
            throw new IllegalStateException("이미 해당 예약에 대한 리뷰가 존재합니다.");
        }

        // 중복 reviewId 체크
        if (reviewMapper.countByReviewId(review.getReviewId()) > 0) {
            throw new DuplicateKeyException("이미 존재하는 리뷰 ID입니다.");
        }

        // 리뷰 저장 (reviewPhotosJson 컬럼에 JSON 문자열 저장된 상태라고 가정)
        int result = reviewMapper.insertReview(review);
        return result == 1;
    }

    // 3. 최신 공개 리뷰 페이징 조회
    @Override
    public List<ReviewDTO> getRecentPublicReviews(int offset, int size) {
        return reviewMapper.selectRecentPublicReviews(offset, size);
    }

    // 4. 로그인한 사용자의 리뷰 + 필터 조건으로 조회
    @Override
    public List<ReviewDTO> getReviewsByUserAndFilter(String userId, int campgroundId, LocalDateTime checkIn,
            LocalDateTime checkOut) {
        return reviewMapper.selectReviewsByUserAndFilter(userId, campgroundId, checkIn, checkOut);
    }

    @Override
    public ReviewDTO getReviewById(String reviewId) {
        return reviewMapper.selectReviewById(reviewId);
    }

    @Override
    public String uploadReviewImage(MultipartFile file, String reviewId) {
        try {
            // 파일 원본 이름에서 확장자 추출
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            // 고유한 파일명 생성 (리뷰 이미지 폴더 아래 저장)
            String uniqueFileName = "review_" + reviewId + "_" + UUID.randomUUID().toString() + extension;

            // 실제 파일 업로드 (FileUploadService에 폴더명, 파일명 전달)
            String fileUrl = fileUploadService.uploadFile(file, uniqueFileName, "images/Review");

            // 업로드 된 이미지 URL을 리뷰에 저장하려면 Mapper 업데이트 코드 추가 가능
            // 예) reviewMapper.updateReviewPhotoUrl(reviewId, fileUrl);

            return fileUrl;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("리뷰 이미지 업로드 실패: " + e.getMessage());
        }
    }
}
