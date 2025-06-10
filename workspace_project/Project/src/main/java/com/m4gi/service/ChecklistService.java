package com.m4gi.service;

import com.m4gi.dto.ChecklistDTO;

import java.util.List;

public interface ChecklistService {

    // 체크리스트 저장
    int saveChecklist(ChecklistDTO checklist);

    // 예약 ID로 체크리스트 조회
    List<ChecklistDTO> getChecklistsByReservationId(String reservationId);

    // 사용자의 체크리스트 조회
    List<ChecklistDTO> getChecklistsByUser(Integer providerCode, String providerUserId);

    // 체크리스트 ID로 조회
    ChecklistDTO getChecklistById(String checklistId);
}