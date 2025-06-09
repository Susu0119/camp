import React, { useState, useCallback } from "react";
import axios from "axios";
import CampsiteInfoSection from "./CampSiteInfoSection";
import ZoneRegistrationSection from "./ZoneRegistrationSection";
import SiteRegistrationSection from "./SiteRegistrationSection";
import RegisteredItemsSection from "./RegisteredItemsSection";

export default function RegistrationForm() {
  const [registeredCampgroundId, setRegisteredCampgroundId] = useState(null);
  const [registeredZones, setRegisteredZones] = useState([]);

  // ★ 존 목록을 서버에서 다시 불러오는 함수
  const fetchZones = useCallback(async () => {
    if (!registeredCampgroundId) return;
    try {
      const response = await axios.get("/web/api/staff/register/my-zones");
      setRegisteredZones(response.data);
    } catch (error) {
      console.error("존 목록을 다시 불러오는 데 실패했습니다:", error);
    }
  }, [registeredCampgroundId]);

  // ★ 캠핑장 등록 성공 시 호출될 함수
  const handleRegistrationSuccess = (newCampgroundId) => {
    alert(`캠핑장 등록 성공! (ID: ${newCampgroundId}) 이제 존을 등록해주세요.`);
    setRegisteredCampgroundId(newCampgroundId);
  };

  // ★ 존 등록 성공 시 호출될 함수
  const handleZoneSuccess = useCallback(() => {
    alert("존이 등록되었습니다. 이어서 사이트를 등록하거나 존을 추가 등록할 수 있습니다.");
    fetchZones(); // 존 목록을 새로고침하여 방금 추가한 존을 반영
  }, [fetchZones]);

  return (
    <section className="flex flex-col items-center mt-10 w-200">
      <div className="pt-2 w-full pb-30">
        {/* 제목 */}
        <header className="w-full">
            <div className="flex flex-col gap-3 mb-3">
                <span className="text-2xl">캠핑장 등록하기</span>
                <span className="text-zinc-500">순서에 따라 정보를 입력해주세요.</span>
            </div>
        </header>
        {/* 입력 본문 */}
        <div className="space-y-5 pt-2 w-full rounded-md">
            {/* 캠핑장 등록 섹션 */}
            <div className="px-5 py-5 w-full rounded-md border border-cgray">
                <CampsiteInfoSection onSuccess={handleRegistrationSuccess} />
            </div>

            {/* campgroundId가 있을 때만 존 등록 섹션을 보여줌 */}
            {registeredCampgroundId && (
              <div className="px-5 py-5 w-full rounded-md border border-cgray">
                <ZoneRegistrationSection 
                  campgroundId={registeredCampgroundId} 
                  onSuccess={handleZoneSuccess} 
                />
              </div>
            )}

            {/* 등록된 존이 1개 이상 있을 때만 사이트 등록 섹션을 보여줌 */}
            {registeredZones.length > 0 && (
              <div className="px-5 py-5 w-full rounded-md border border-cgray">
                <SiteRegistrationSection 
                  campgroundId={registeredCampgroundId}
                  zones={registeredZones}
                />
              </div>
            )}

            <div className="px-5 py-5 w-full rounded-md border border-cgray">
                <RegisteredItemsSection />
            </div>
        </div>
      </div>
    </section>
  );
}
