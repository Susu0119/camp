package com.m4gi.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationDTO; // ReservationDTO 임포트
import com.m4gi.dto.ReservationResponseDTO;
import com.m4gi.dto.UserDTO; // UserDTO 임포트
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
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 만들어주는 Lombok 어노테이션
public class UserMypageReservationsImpl implements UserMypageReservationsService {

    // --- 의존성 주입 ---
    // @RequiredArgsConstructor를 사용하므로 final 키워드를 붙여 생성자 주입 방식으로 통일합니다.
    private final UserMypageReservationsMapper userMypageReservationsMapper;
    private final ReservationMapper reservationMapper; // 예약 취소 알림을 위해 예약 정보를 조회할 때 사용
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
    // 이 메서드는 일반적으로 서비스 내부에서 호출되거나, DTO에 requestedAt이 이미 설정된 경우 사용될 수 있습니다.
    // 실질적인 취소 로직은 아래 updateReservationCancel(CancelReservationRequestDTO dto, UserDTO currentUser)에서 처리합니다.
    public int cancelReservation(CancelReservationRequestDTO dto) {
        // 이 메서드는 알림 생성 로직을 포함하지 않습니다. 주로 내부에서 사용될 수 있습니다.
        return userMypageReservationsMapper.updateReservationCancel(
                dto.getReservationId(),
                dto.getCancelReason(),
                dto.getRefundStatus(),
                new java.sql.Timestamp(dto.getRequestedAt().getTime()));
    }

    @Override
    @Transactional // 트랜잭션 보장
    // --- UserDTO currentUser 파라미터 추가 ---
    public int updateReservationCancel(CancelReservationRequestDTO dto, UserDTO currentUser) throws Exception {
        if (dto.getRequestedAt() == null) {
            dto.setRequestedAt(new java.util.Date());
        }
        int updateResult = userMypageReservationsMapper.updateReservationCancel(
                dto.getReservationId(),
                dto.getCancelReason(),
                dto.getRefundStatus(),
                new java.sql.Timestamp(dto.getRequestedAt().getTime()));

        // --- 예약 취소 알림 생성 및 삽입 ---
        if (updateResult > 0) { // 예약 취소가 성공했을 때만 알림 생성
            try {
                NoticeDTO notice = new NoticeDTO();
                // Lombok @Data 사용 시 Setter는 필드명 그대로 snake_case를 따릅니다.
                notice.setNotice_title("예약 취소 완료 😢");
                
                // 취소된 예약의 캠핑장 이름을 알림 내용에 포함하기 위해 ReservationMapper로 조회
                ReservationDTO cancelledReservation = reservationMapper.getReservationByReservationId(dto.getReservationId());
                String campgroundName = (cancelledReservation != null && cancelledReservation.getCampgroundName() != null)
                                        ? cancelledReservation.getCampgroundName() : "캠핑장";

                notice.setNotice_content(String.format("'%s' 예약 (예약번호: %s)이 취소되었습니다. 취소 사유: %s",
                                            campgroundName, dto.getReservationId(), dto.getCancelReason()));

                // 현재 로그인한 사용자 정보를 알림 대상자로 설정
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
     * 이 메서드는 PaymentServiceImpl에서 호출되는 예약 저장 로직과는 별개일 수 있습니다.
     * 만약 결제 후 예약 저장을 이 메서드에서 한다면, PaymentServiceImpl의 해당 로직을 제거해야 합니다.
     * 여기서는 ReservationDTO에 이미 providerCode와 providerUserId가 포함되어 있다고 가정합니다.
     */
    @Override
    @Transactional // 예약과 알림 생성을 하나의 트랜잭션으로 묶어 데이터 일관성을 보장합니다.
    public void addReservation(ReservationDTO reservation) {
        // 1. 예약 정보 저장
        reservationMapper.insertReservation(reservation);

        // 2. 예약 성공 후, 알림 객체 생성
        NoticeDTO notice = new NoticeDTO();

        // Lombok @Data 사용 시 Setter는 필드명 그대로 snake_case를 따릅니다.
        notice.setNotice_title("예약 완료 🎉");
        notice.setNotice_content("'" + reservation.getCampgroundName() + "' 예약이 완료되었습니다.");
        
        // reservation DTO에 사용자 정보(providerCode, providerUserId)가 직접 포함되어 있다고 가정
        notice.setProviderCode(reservation.getProviderCode());
        notice.setProviderUserId(reservation.getProviderUserId());
            
        // 3. NoticeService를 통해 알림 저장
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