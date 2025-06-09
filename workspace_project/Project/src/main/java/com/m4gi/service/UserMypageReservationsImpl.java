package com.m4gi.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.CanceledReservationsDTO; // 이 import는 더 이상 필요 없을 수 있습니다.
import com.m4gi.dto.ReservationResponseDTO;
import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.mapper.UserMypageReservationsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserMypageReservationsImpl implements UserMypageReservationsService {

    private final UserMypageReservationsMapper userMypageReservationsMapper;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<ReservationResponseDTO> getOngoingReservations(int providerCode, String providerUserId) {
        List<UserMypageReservationsDTO> originalList = userMypageReservationsMapper.selectOngoingReservations(providerCode, providerUserId);
        return transformToResponseDtoList(originalList);
    }

    @Override
    public List<ReservationResponseDTO> getCompletedReservations(int providerCode, String providerUserId) {
        List<UserMypageReservationsDTO> originalList = userMypageReservationsMapper.getCompletedReservations(providerCode, providerUserId);
        return transformToResponseDtoList(originalList);
    }

    /**
     * ✅ [수정] 취소/환불 내역 조회
     * 이제 다른 예약 조회와 동일하게, 이미지 URL이 포함된 ReservationResponseDTO 리스트를 반환합니다.
     */
    @Override
    public List<ReservationResponseDTO> getCanceledReservations(int providerCode, String providerUserId) {
        // DB에서 원본 데이터를 가져옵니다.
        List<UserMypageReservationsDTO> originalList = userMypageReservationsMapper.getCanceledReservations(providerCode, providerUserId);
        
        // 다른 메소드들처럼 동일한 변환 로직을 적용합니다.
        return transformToResponseDtoList(originalList);
    }

    // --- 나머지 서비스 메소드들 ---
    
    @Override
    public int cancelReservation(CancelReservationRequestDTO dto) {
        // 모든 reservationId가 String 타입이므로, 타입 변환 없이 그대로 전달합니다.
        return userMypageReservationsMapper.updateReservationCancel(
                dto.getReservationId(),
                dto.getCancelReason(),
                dto.getRefundStatus(),
                new java.sql.Timestamp(dto.getRequestedAt().getTime())
        );
    }

    @Override
    public int updateReservationCancel(CancelReservationRequestDTO dto) throws Exception {
        if (dto.getRequestedAt() == null) {
            dto.setRequestedAt(new java.util.Date());
        }
        // 모든 reservationId가 String 타입이므로, 타입 변환 없이 그대로 전달합니다.
        return userMypageReservationsMapper.updateReservationCancel(
                dto.getReservationId(),
                dto.getCancelReason(),
                dto.getRefundStatus(),
                new java.sql.Timestamp(dto.getRequestedAt().getTime())
        );
    }

    // --- Helper Methods ---

    /**
     * 원본 DTO 리스트를 프론트엔드용 DTO 리스트로 변환하는 메소드.
     */
    private List<ReservationResponseDTO> transformToResponseDtoList(List<UserMypageReservationsDTO> originalList) {
        if (originalList == null || originalList.isEmpty()) {
            return Collections.emptyList();
        }
        return originalList.stream()
                .map(this::transformToResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * 원본 DTO 한 개를 프론트엔드용 DTO 한 개로 변환하는 핵심 로직.
     */
    private ReservationResponseDTO transformToResponseDto(UserMypageReservationsDTO originalDto) {
        ReservationResponseDTO responseDto = new ReservationResponseDTO();

        // 2. 기본 정보 복사
        responseDto.setReservationId(originalDto.getReservationId());
        responseDto.setCampgroundName(originalDto.getCampgroundName());
        responseDto.setAddrFull(originalDto.getAddrFull());
        responseDto.setReservationDate(originalDto.getReservationDate());
        responseDto.setEndDate(originalDto.getEndDate());
        responseDto.setTotalPrice(originalDto.getTotalPrice());
        responseDto.setReservationStatus(originalDto.getReservationStatus());
        responseDto.setCheckinStatus(originalDto.getCheckinStatus());
        
        // ✅ [추가] refundStatus 필드를 복사합니다.
        responseDto.setRefundStatus(originalDto.getRefundStatus());

        // 3. JSON 파싱 및 썸네일 URL 추출
        String jsonImageString = originalDto.getCampgroundImage();
        if (jsonImageString != null && !jsonImageString.isEmpty()) {
            try {
                Map<String, List<String>> imageMap = objectMapper.readValue(jsonImageString, new TypeReference<>() {});
                List<String> thumbnailList = imageMap.get("thumbnail");
                if (thumbnailList != null && !thumbnailList.isEmpty()) {
                    responseDto.setCampgroundThumbnailUrl(thumbnailList.get(0));
                }
            } catch (IOException e) {
                System.err.println("JSON 파싱 오류 발생 (Reservation ID: " + originalDto.getReservationId() + "): " + e.getMessage());
            }
        }
        return responseDto;
    }
}
