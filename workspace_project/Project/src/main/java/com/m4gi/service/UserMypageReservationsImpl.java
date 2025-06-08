package com.m4gi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.CanceledReservationsDTO;
import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.dto.UserMypageReservationsDTO.CampgroundImage;
import com.m4gi.mapper.UserMypageReservationsMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserMypageReservationsImpl implements UserMypageReservationsService {

    private final UserMypageReservationsMapper userMypageReservationsMapper;

    private final ObjectMapper mapper = new ObjectMapper(); // ObjectMapper를 필드로 선언해 재사용

    /**
     * 예약 상세 조회 (진행중인 예약 목록)
     */
    @Override
    public List<UserMypageReservationsDTO> getOngoingReservations(int providerCode, String providerUserId) {
        List<UserMypageReservationsDTO> list = userMypageReservationsMapper.selectOngoingReservations(providerCode, providerUserId);

        for (UserMypageReservationsDTO dto : list) {
            String json = dto.getCampgroundImage();
            
            System.out.println("원본 JSON 문자열: " + json);

            if (json != null && !json.isEmpty()) {
                try {
                    JsonNode node = mapper.readTree(json);
                    System.out.println("파싱된 JSON Node: " + node.toPrettyString());

                    if (node.isObject()) {
                        CampgroundImage image = mapper.treeToValue(node, CampgroundImage.class);
                        dto.setCampgroundImageMap(image);
                        System.out.println("변환된 CampgroundImage: " + image); 
                    } else if (node.isArray()) {
                        System.out.println("campgroundImage 필드가 배열 형태입니다. 변환 불가: " + json);
                        dto.setCampgroundImageMap(null);
                    } else {
                        dto.setCampgroundImageMap(null);
                    }
                } catch (Exception e) {
                    System.out.println("JSON 파싱 중 오류 발생: " + e.getMessage());
                    e.printStackTrace();
                    dto.setCampgroundImageMap(null);
                }
            } else {
                System.out.println("campgroundImage가 null 또는 빈 문자열입니다.");
                dto.setCampgroundImageMap(null);
            }
        }

        System.out.println("서비스에서 조회된 예약 리스트 크기: " + list.size());
        for (UserMypageReservationsDTO dto : list) {
            System.out.println(dto);
        }

        return list;
    }

    /**
     * 예약 취소
     */
    @Override
    public int cancelReservation(CancelReservationRequestDTO dto) {
        return userMypageReservationsMapper.updateReservationCancel(
                dto.getReservationId(),
                dto.getCancelReason(),
                dto.getRefundStatus(),
                new java.sql.Timestamp(dto.getRequestedAt().getTime())
        );
    }

    /**
     * 예약 취소 시 상태 업데이트
     */
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

    /**
     * 예약 취소/환불 내역 조회
     */
    @Override
    public List<CanceledReservationsDTO> getCanceledReservations(int providerCode, String providerUserId) {
        return userMypageReservationsMapper.getCanceledReservations(providerCode, providerUserId);
    }

    /**
     * 이용 완료된 예약 목록 조회
     */
    @Override
    public List<UserMypageReservationsDTO> getCompletedReservations(int providerCode, String providerUserId) {
        return userMypageReservationsMapper.getCompletedReservations(providerCode, providerUserId);
    }
}
