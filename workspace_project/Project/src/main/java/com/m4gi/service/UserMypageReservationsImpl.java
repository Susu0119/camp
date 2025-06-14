package com.m4gi.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationDTO;
import com.m4gi.dto.ReservationResponseDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.mapper.ReservationMapper;
import com.m4gi.mapper.UserMypageReservationsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserMypageReservationsImpl implements UserMypageReservationsService {

    private final UserMypageReservationsMapper userMypageReservationsMapper;
    private final ReservationMapper reservationMapper;
    private final NoticeService noticeService;
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
     */
    @Override
    public List<ReservationResponseDTO> getCanceledReservations(int providerCode, String providerUserId) {
        List<UserMypageReservationsDTO> originalList = userMypageReservationsMapper
                .getCanceledReservations(providerCode, providerUserId);
        return transformToResponseDtoList(originalList);
    }

    // 이 cancelReservation 메서드는 UserMypageReservationsService 인터페이스에 선언되어 있지 않고,
    // 현재 프로젝트에서 사용되는지 불분명하므로, 만약 사용하지 않는다면 제거하는 것이 좋습니다.
    // 만약 사용한다면, 아래 updateReservationCancel과 동일하게 매개변수를 맞춰줘야 합니다.
    @Override
    public int cancelReservation(CancelReservationRequestDTO dto) {
        // 이 메서드를 호출하는 컨텍스트에서 providerCode와 providerUserId를 알 수 없으므로,
        // 이 메서드가 실제로 사용된다면 해당 정보가 DTO에 포함되거나 다른 방식으로 전달되어야 합니다.
        // 현재는 Mapper 호출 시 임시값 0과 null을 전달합니다.
        return userMypageReservationsMapper.updateReservationCancel(
                dto.getReservationId(),
                dto.getCancelReason(),
                dto.getCustomReason(),
                dto.getRefundStatus(),
                new java.sql.Timestamp(dto.getRequestedAt().getTime()),
                0, // providerCode: 임시값. 실제 사용 시 적절한 값으로 변경 필요.
                null // providerUserId: 임시값. 실제 사용 시 적절한 값으로 변경 필요.
        );
    }

    @Override
    @Transactional
    public int updateReservationCancel(CancelReservationRequestDTO dto, UserDTO currentUser) {
        if (dto.getRequestedAt() == null) {
            dto.setRequestedAt(new java.util.Date());
        }

        // Mapper 메서드 호출 시 파라미터 순서와 개수를 Mapper 인터페이스와 정확히 일치시킵니다.
        int updateResult = userMypageReservationsMapper.updateReservationCancel(
                dto.getReservationId(),
                dto.getCancelReason(),
                dto.getCustomReason(), // customReason
                dto.getRefundStatus(),
                new java.sql.Timestamp(dto.getRequestedAt().getTime()), // requestedAt
                currentUser.getProviderCode(),   // currentUser에서 providerCode 가져오기
                currentUser.getProviderUserId()  // currentUser에서 providerUserId 가져오기
        );

        // --- 예약 취소 알림 생성 및 삽입 ---
        if (updateResult > 0) {
            try {
                NoticeDTO notice = new NoticeDTO();
                notice.setNoticeTitle("예약 취소 완료 😢");
                
                ReservationDTO cancelledReservation = reservationMapper.getReservationByReservationId(dto.getReservationId());
                String campgroundName = (cancelledReservation != null && cancelledReservation.getCampgroundName() != null)
                                                 ? cancelledReservation.getCampgroundName() : "캠핑장";

                String noticeContent = String.format("'%s' 예약이 취소되었습니다. 취소 사유: %s",
                                                     campgroundName, dto.getCancelReason());
                if (dto.getCustomReason() != null && !dto.getCustomReason().trim().isEmpty()) {
                    noticeContent += String.format(" (상세 사유: %s)", dto.getCustomReason());
                }
                notice.setNoticeContent(noticeContent);

                notice.setProviderCode(currentUser.getProviderCode());
                notice.setProviderUserId(currentUser.getProviderUserId());

                noticeService.addNotice(notice);
                System.out.println("[알림] 예약 취소 완료 알림이 성공적으로 생성되었습니다. 예약번호: " + dto.getReservationId());

            } catch (Exception e) {
                System.err.println("[오류] 예약 취소 알림 생성 중 오류 발생 (예약번호: " + dto.getReservationId() + "): " + e.getMessage());
                e.printStackTrace();
            }
        }
        return updateResult;
    }

    /**
     * ✅ 새로운 예약을 추가하고, 예약 완료 알림을 생성하는 핵심 메소드
     */
    @Override
    @Transactional
    public void addReservation(ReservationDTO reservation) {
        reservationMapper.insertReservation(reservation);

        NoticeDTO notice = new NoticeDTO();
        notice.setNoticeTitle("예약 완료 🎉");
        notice.setNoticeContent("'" + reservation.getCampgroundName() + "' 예약이 완료되었습니다.");
        
        notice.setProviderCode(reservation.getProviderCode());
        notice.setProviderUserId(reservation.getProviderUserId());
            
        noticeService.addNotice(notice);
        System.out.println("[알림] 예약 완료 알림이 성공적으로 생성되었습니다.");
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
        
        // ✨ UserMypageReservationsDTO에서 cancelReason과 customReason을 가져와 설정
        responseDto.setCancelReason(originalDto.getCancelReason());
        responseDto.setCustomReason(originalDto.getCustomReason());

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