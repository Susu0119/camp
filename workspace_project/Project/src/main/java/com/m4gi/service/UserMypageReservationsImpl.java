package com.m4gi.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationDTO;
import com.m4gi.dto.ReservationResponseDTO;
import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.mapper.ReservationMapper;
import com.m4gi.mapper.UserMypageReservationsMapper;
import com.m4gi.service.NoticeService; // NoticeService import 확인
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 만들어주는 Lombok 어노테이션
public class UserMypageReservationsImpl implements UserMypageReservationsService {

    // --- 의존성 주입 ---
    // @RequiredArgsConstructor를 사용하므로 final 키워드를 붙여 생성자 주입 방식으로 통일합니다.
    private final UserMypageReservationsMapper userMypageReservationsMapper;
    private final ReservationMapper reservationMapper;
    private final NoticeService noticeService; // NoticeService도 생성자 주입 방식에 포함
    private final ObjectMapper objectMapper = new ObjectMapper();


    @Override
    public List<ReservationResponseDTO> getOngoingReservations(int providerCode, String providerUserId) {
        List<UserMypageReservationsDTO> originalList = userMypageReservationsMapper
                .selectOngoingReservations(providerCode, providerUserId);
        return transformToResponseDtoList(originalList);
    }

    @Override
    public List<ReservationResponseDTO> getCompletedReservations(int providerCode, String providerUserId) {
        List<UserMypageReservationsDTO> originalList = userMypageReservationsMapper
                .getCompletedReservations(providerCode, providerUserId);
        return transformToResponseDtoList(originalList);
    }

    /**
     * ✅취소/환불 내역 조회
     * 이제 다른 예약 조회와 동일하게, 이미지 URL이 포함된 ReservationResponseDTO 리스트를 반환합니다.
     */
    @Override
    public List<ReservationResponseDTO> getCanceledReservations(int providerCode, String providerUserId) {
        List<UserMypageReservationsDTO> originalList = userMypageReservationsMapper
                .getCanceledReservations(providerCode, providerUserId);
        return transformToResponseDtoList(originalList);
    }

    @Override
    public int cancelReservation(CancelReservationRequestDTO dto) {
        return userMypageReservationsMapper.updateReservationCancel(
                dto.getReservationId(),
                dto.getCancelReason(),
                dto.getRefundStatus(),
                new java.sql.Timestamp(dto.getRequestedAt().getTime()));
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
                new java.sql.Timestamp(dto.getRequestedAt().getTime()));
    }
    
    /**
     * ✅ 새로운 예약을 추가하고, 예약 완료 알림을 생성하는 핵심 메소드
     */
    @Override
    @Transactional // 예약과 알림 생성을 하나의 트랜잭션으로 묶어 데이터 일관성을 보장합니다.
    public void addReservation(ReservationDTO reservation) {
        // 1. 예약 정보 저장
        reservationMapper.insertReservation(reservation);

        // 2. 예약 성공 후, 알림 객체 생성
        NoticeDTO notice = new NoticeDTO();

        notice.setNoticeTitle("예약 완료");
        notice.setNoticeContent("'" + reservation.getCampgroundName() + "' 예약이 완료되었습니다.");
        notice.setProviderCode(reservation.getProviderCode());
        notice.setProviderUserId(reservation.getProviderUserId());
        
        // 3. NoticeService를 통해 알림 저장 (요청하신 메소드명으로 수정)
        noticeService.addNotice(notice);
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

        responseDto.setReservationId(originalDto.getReservationId());
        responseDto.setCampgroundName(originalDto.getCampgroundName());
        responseDto.setAddrFull(originalDto.getAddrFull());
        responseDto.setReservationDate(originalDto.getReservationDate());
        responseDto.setEndDate(originalDto.getEndDate());
        responseDto.setTotalPrice(originalDto.getTotalPrice());
        responseDto.setReservationStatus(originalDto.getReservationStatus());
        responseDto.setCheckinStatus(originalDto.getCheckinStatus());
        responseDto.setTotalPeople(originalDto.getTotalPeople());
        responseDto.setRefundStatus(originalDto.getRefundStatus());
        responseDto.setZoneName(originalDto.getZoneName());
        responseDto.setZoneType(originalDto.getZoneType());
        responseDto.setReservationSite(originalDto.getReservationSite());

        String jsonImageString = originalDto.getCampgroundImage();
        if (jsonImageString != null && !jsonImageString.isEmpty()) {
            try {
                Map<String, List<String>> imageMap = objectMapper.readValue(jsonImageString, new TypeReference<>() {});
                List<String> thumbnailList = imageMap.get("thumbnail");
                if (thumbnailList != null && !thumbnailList.isEmpty()) {
                    responseDto.setCampgroundThumbnailUrl(thumbnailList.get(0));
                }
            } catch (IOException e) {
                System.err.println(
                        "JSON 파싱 오류 발생 (Reservation ID: " + originalDto.getReservationId() + "): " + e.getMessage());
            }
        }
        return responseDto;
    }
}