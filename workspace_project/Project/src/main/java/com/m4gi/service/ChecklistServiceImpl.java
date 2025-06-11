package com.m4gi.service;

import com.m4gi.dto.ChecklistDTO;
import com.m4gi.mapper.ChecklistMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChecklistServiceImpl implements ChecklistService {

    private final ChecklistMapper checklistMapper;

    @Override
    public int saveChecklist(ChecklistDTO checklist) {
        return checklistMapper.insertChecklist(checklist);
    }

    @Override
    public List<ChecklistDTO> getChecklistsByReservationId(String reservationId) {
        return checklistMapper.selectChecklistsByReservationId(reservationId);
    }

    @Override
    public List<ChecklistDTO> getChecklistsByUser(Integer providerCode, String providerUserId) {
        return checklistMapper.selectChecklistsByUser(providerCode, providerUserId);
    }

    @Override
    public ChecklistDTO getChecklistById(String checklistId) {
        return checklistMapper.selectChecklistById(checklistId);
    }
}