package com.m4gi.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.CanceledReservationsDTO;
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

    // --- 나머지 서비스 메소드들 ---
    
    @Override
    public int cancelReservation(CancelReservationRequestDTO dto) {
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
        return userMypageReservationsMapper.updateReservationCancel(
                dto.getReservationId(),
                dto.getCancelReason(),
                dto.getRefundStatus(),
                new java.sql.Timestamp(dto.getRequestedAt().getTime())
        );
    }

    @Override
    public List<CanceledReservationsDTO> getCanceledReservations(int providerCode, String providerUserId) {
        return userMypageReservationsMapper.getCanceledReservations(providerCode, providerUserId);
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
        // 1. 응답용 DTO 객체 생성
        ReservationResponseDTO responseDto = new ReservationResponseDTO();

        // 2. 기본 정보 복사
        // 두 DTO 모두 reservationId가 String 타입이므로, 타입 변환 없이 바로 값을 설정합니다.
        responseDto.setReservationId(originalDto.getReservationId());
        
        responseDto.setCampgroundName(originalDto.getCampgroundName());
        responseDto.setAddrFull(originalDto.getAddrFull());
        responseDto.setReservationDate(originalDto.getReservationDate());
        responseDto.setEndDate(originalDto.getEndDate());
        responseDto.setTotalPrice(originalDto.getTotalPrice());
        responseDto.setReservationStatus(originalDto.getReservationStatus());
        responseDto.setCheckinStatus(originalDto.getCheckinStatus());

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
                // 실제 운영 환경에서는 e.printStackTrace() 대신 로깅 프레임워크(slf4j 등) 사용을 권장합니다.
                System.err.println("JSON 파싱 오류 발생 (Reservation ID: " + originalDto.getReservationId() + "): " + e.getMessage());
            }
        }
        return responseDto; // 명시적으로 ReservationResponseDTO를 반환
    }
}
