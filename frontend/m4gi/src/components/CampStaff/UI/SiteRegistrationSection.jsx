import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import FormInput from "./FormInput";
import Button from "../../Common/Button";

const initialFormState = {
  zoneId: "",
  siteName: "",
  capacity: "",
  widthMeters: "",
  heightMeters: "",
};

export default function SiteRegistrationSection({ campgroundId, zones, editingSite, onSuccess }) {
  const [formData, setFormData] = useState(initialFormState);
  const isEditMode = !!editingSite;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'zoneId') {
      const selectedZone = zones.find(z => z.zoneId == value);
      const newCapacity = selectedZone ? selectedZone.capacity : "";
        
      setFormData(prev => ({
        ...prev,
        zoneId: value,
        capacity: newCapacity 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ★ '수정 모드' 상태 동기화
  useEffect(() => {
    if (isEditMode && editingSite) {
      setFormData({
        zoneId: editingSite.zoneId?.toString() || "",
        siteName: editingSite.siteName || "",
        capacity: editingSite.capacity?.toString() || "",
        widthMeters: editingSite.widthMeters?.toString() || "",
        heightMeters: editingSite.heightMeters?.toString() || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingSite, isEditMode]);


  // ★ '등록 모드'일 때 기본값 설정
  useEffect(() => {
    if (!isEditMode && zones.length > 0) {
      if (!formData.zoneId) {
        const defaultZone = zones[0];
        setFormData(prev => ({
          ...prev,
          zoneId: defaultZone.zoneId,
          capacity: defaultZone.capacity
        }));
      }
    }
  }, [zones, isEditMode, formData.zoneId]);

  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.zoneId) {
      return Swal.fire({
        title: '입력 오류',
        text: '소속 존을 선택해주세요.',
        icon: 'warning',
        showConfirmButton: false,
        timer: 1500
      });
    }
    if (!formData.siteName.trim()) {
      return Swal.fire({
        title: '입력 오류',
        text: '사이트 이름을 입력해주세요.',
        icon: 'warning',
        showConfirmButton: false,
        timer: 1500
      });
    }

    const payload = {
      campgroundId,
      ...formData,
      capacity: Number(formData.capacity) || null,
      widthMeters: Number(formData.widthMeters) || null,
      heightMeters: Number(formData.heightMeters) || null,
    };

    try {
      const action = isEditMode ? "수정" : "등록";
      if (isEditMode) {
        await axios.put(`/web/api/staff/register/sites/${editingSite.siteId}`, payload);
      } else {
        await axios.post("/web/api/staff/register/sites", payload);
      }

      await Swal.fire({
        title: `${action} 완료!`,
        text: `사이트 정보가 성공적으로 ${action}되었습니다.`,
        icon: 'success',
        iconColor: '#8C06AD',
        confirmButtonColor: '#8C06AD',
      });
      setFormData(initialFormState);
      onSuccess();
    } catch (err) {
      const action = isEditMode ? "수정" : "등록";
      console.error(`${action} 실패:`, err);
      Swal.fire({
        title: `${action} 실패`,
        text: `존 정보 ${action} 중 오류가 발생했습니다.`,
        icon: 'error',
        confirmButtonColor: '#8C06AD',
      });
    }
  };

  const handleCancelEdit = () => {
    onSuccess();
  };

  const selectedZone = zones.find(z => z.zoneId == formData.zoneId);

  return (
    <div className="p-4">
      <header className="flex flex-col gap-2 mb-4">
        <h2 className="text-xl text-cpurple">{isEditMode ? '사이트 수정' : '사이트 등록'}</h2>
        <p className="text-sm text-zinc-500">{isEditMode ? `'${editingSite.siteName}'의 정보를 수정합니다.` : '존에 포함될 개별 사이트를 등록해주세요.'}</p>
      </header>
      <div className="space-y-4">
        <div>소속 존</div>
        <select name="zoneId" value={formData.zoneId} onChange={handleChange} className="w-full px-4 py-2 border rounded">
          {zones.length === 0 && <option>선택 가능한 존이 없습니다.</option>}
          {!formData.zoneId && zones.length > 0 && <option value="">존을 선택해주세요</option>}
          {zones.map(zone => (
            <option key={zone.zoneId} value={zone.zoneId}>{zone.zoneName}</option>
          ))}
        </select>
        
        <div>사이트 이름/번호</div>
        <FormInput name="siteName" placeholder="예: A-1, B-2" value={formData.siteName} onChange={handleChange} />
        
        <div>
          <label>수용 인원</label>
          <div className="w-full px-4 py-2 mt-3 bg-zinc-100 text-zinc-500 border rounded">
            {selectedZone ? `${selectedZone.capacity} 명 (소속된 존의 최대 인원을 따릅니다)` : '존을 먼저 선택해주세요.'}
          </div>
        </div>

        <label>사이트 크기</label>
        <div className="flex justify-center gap-4 items-center w-full">
          <FormInput type="number" name="widthMeters" placeholder="가로 길이(m)" value={formData.widthMeters} onChange={handleChange} />
          <span>x</span>
          <FormInput type="number" name="heightMeters" placeholder="세로 길이(m)" value={formData.heightMeters} onChange={handleChange} />
        </div>
        
        <div className="flex gap-4 mt-8 w-full">
          <Button type="button" onClick={handleSubmit} className="w-full py-2 bg-cpurple text-white rounded">
            {isEditMode ? '수정 완료' : '사이트 등록'}
          </Button>
          {isEditMode && (
            <Button type="button" onClick={handleCancelEdit} className="w-full py-2 bg-clpurple text-cpurple rounded">
              취소
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}