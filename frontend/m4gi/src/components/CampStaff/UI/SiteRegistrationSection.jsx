import React, { useState, useEffect } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import Button from "../../Common/Button";

export default function SiteRegistrationSection({ campgroundId, zones, onSuccess }) {
  const [selectedZoneId, setSelectedZoneId] = useState(""); // 선택된 존 ID
  const [siteName, setSiteName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  // ★ props로 받은 zones가 바뀔 때 selectedZoneId를 설정
  useEffect(() => {
    if (zones && zones.length > 0) {
      if (!zones.find(z => z.zoneId === selectedZoneId)) {
        setSelectedZoneId(zones[0].zoneId);
      }
    }
  }, [zones, selectedZoneId]);

  // ★ 폼 초기화 함수
  const clearForm = () => {
      setSiteName("");
      setWidth("");
      setHeight("");
      // selectbox는 목록의 첫번째 항목으로 초기화
      if (zones && zones.length > 0) {
          setSelectedZoneId(zones[0].zoneId);
      }
  }

  // ★ 사이트 등록 처리 함수
  const handleRegisterSite = async () => {
    if (!selectedZoneId) {
        alert("소속 존을 선택해주세요.");
        return;
    }
    if (!siteName.trim()) {
        alert("사이트 이름 또는 번호를 입력해주세요.");
        return;
    }

    const payload = {
        campgroundId,
        zoneId: Number(selectedZoneId),
        siteName,
        widthMeters: Number(width) || null,
        heightMeters: Number(height) || null,
    };
    
    console.log("서버로 전송되는 사이트 데이터:", payload);

    try {
        await axios.post("/web/api/staff/register/sites", payload);
        alert("✅ 사이트 등록 성공!");
        clearForm(); // 성공 후 폼 초기화
        if (onSuccess) { // 등록 성공 후 부모에게 받은 함수를 호출
            onSuccess();        
        }
    } catch (error) {
        console.error("사이트 등록 실패:", error);
        alert("❌ 사이트 등록 실패: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-4">
      <header className="flex flex-col gap-2 mb-4">
        <h2 className="text-xl text-cpurple">사이트 등록</h2>
        <p className="text-sm text-zinc-500">존(구역) 내 개별 사이트를 등록해주세요.</p>
      </header>
      <div className="space-y-4">
        {/* ★ 동적으로 존 선택 드롭다운 생성 */}
        <label>소속 존</label>
        <select 
          value={selectedZoneId} 
          onChange={(e) => setSelectedZoneId(e.target.value)} 
          className="w-full px-4 py-2 mb-4 border border-zinc-200 rounded"
          disabled={zones.length === 0} // 존이 없으면 비활성화
        >
            {zones.length > 0 ? (
                zones.map((zone) => (
                    <option key={zone.zoneId} value={zone.zoneId}>
                    {zone.zoneName}
                    </option>
                ))
                ) : (
                <option value="">-- 등록된 존이 없습니다 --</option>
            )}
        </select>
        
        <label>사이트 이름/번호</label>
        <FormInput 
          placeholder="예: 01, 02, 별, 달" 
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
        />
    
        <label>사이트 크기 (선택 사항)</label>
        <div className="flex justify-center gap-4 items-center w-full">
            <FormInput type="number" placeholder="가로(m)" value={width} onChange={(e) => setWidth(e.target.value)}/>
            <span>x</span>
            <FormInput type="number" placeholder="세로(m)" value={height} onChange={(e) => setHeight(e.target.value)}/>
        </div>

        <Button onClick={handleRegisterSite} type="button" className="w-full mt-4 py-2 bg-cpurple text-white rounded">
          사이트 등록
        </Button>
      </div>
    </div>
  );
}