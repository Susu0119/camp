package com.m4gi.mapper;

import com.m4gi.dto.ChecklistDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChecklistMapper {

    // 체크리스트 저장
    int insertChecklist(ChecklistDTO checklist);

    // 예약 ID로 체크리스트 조회
    List<ChecklistDTO> selectChecklistsByReservationId(@Param("reservationId") String reservationId);

    // 사용자의 체크리스트 조회
    List<ChecklistDTO> selectChecklistsByUser(@Param("providerCode") Integer providerCode,
            @Param("providerUserId") String providerUserId);

    // 체크리스트 ID로 조회
    ChecklistDTO selectChecklistById(@Param("checklistId") String checklistId);
}