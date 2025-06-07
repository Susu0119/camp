package com.m4gi.service;

import java.util.Collections;

import java.util.List;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.CanceledReservationsDTO;
import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.mapper.UserMypageReservationsMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserMypageReservationsImpl implements UserMypageReservationsService {

    private final UserMypageReservationsMapper userMypageReservationsMapper;

    // 예약 상세 조회
    @Override
    public List<UserMypageReservationsDTO> getOngoingReservations(int providerCode, String providerUserId) {
        List<UserMypageReservationsDTO> list = userMypageReservationsMapper.selectOngoingReservations(providerCode, providerUserId);
        ObjectMapper mapper = new ObjectMapper();

        for (UserMypageReservationsDTO dto : list) {
            String json = dto.getCampgroundImage();
            if (json != null && !json.isEmpty()) {
                try {
                    // JSON 문자열을 List<String>으로 변환
                    List<String> images = mapper.readValue(json, new TypeReference<List<String>>() {});
                    dto.setImages(images);
                } catch (Exception e) {
                    e.printStackTrace();
                    // 변환 실패 시 빈 리스트 세팅
                    dto.setImages(Collections.emptyList());
                }
            } else {
                dto.setImages(Collections.emptyList());
            }
        }
        System.out.println("서비스에서 조회된 예약 리스트 크기: " + list.size());
        for (UserMypageReservationsDTO dto : list) {
            System.out.println(dto);
        }
        return list;
    }


    // 예약 취소
    @Override
    public int cancelReservation(CancelReservationRequestDTO dto) {
        return userMypageReservationsMapper.updateReservationCancel(
                dto.getReservationId(),
                dto.getCancelReason(),
                dto.getRefundStatus(),
                new java.sql.Timestamp(dto.getRequestedAt().getTime())
        );
    }

    // 사용자 예약 취소 버튼 클릭 시 db에 취소 상태 업데이트
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

    // 예약 취소/환불 내역 조회
    @Override
    public List<CanceledReservationsDTO> getCanceledReservations(int providerCode, String providerUserId) {
        return userMypageReservationsMapper.getCanceledReservations(providerCode, providerUserId);
    }

    // 이용 완료된 예약 목록 조회
    @Override
    public List<UserMypageReservationsDTO> getCompletedReservations(int providerCode, String providerUserId) {
        return userMypageReservationsMapper.getCompletedReservations(providerCode, providerUserId);
    }
}
