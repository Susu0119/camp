import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import CampsiteInfoSection from "./CampSiteInfoSection";
import ZoneRegistrationSection from "./ZoneRegistrationSection";
import SiteRegistrationSection from "./SiteRegistrationSection";
import RegisteredItemsSection from "./RegisteredItemsSection";

export default function RegistrationForm() {
  const [registeredCampgroundId, setRegisteredCampgroundId] = useState(null);
  const [registeredZones, setRegisteredZones] = useState([]);
  const [registeredSites, setRegisteredSites] = useState([]);

  const [initialCampsiteData, setInitialCampsiteData] = useState(null);

  
  // ★ 존 목록을 다시 불러오는 함수
  const fetchZones = useCallback(async () => {
    if (!registeredCampgroundId) return; // 이제 인자가 아닌 상태값을 사용
    try {
      const response = await axios.get("/web/api/staff/register/my-zones");
      setRegisteredZones(response.data);
    } catch (error) {
      console.error("존 목록을 다시 불러오는 데 실패했습니다:", error);
    }
  }, [registeredCampgroundId]);
  
  // ★ 사이트 목록을 불러오는 함수
  const fetchSites = useCallback(async () => {
    if (!registeredCampgroundId) return;
    try {
      const response = await axios.get("/web/api/staff/register/my-sites");
      setRegisteredSites(response.data);
    } catch (error) {
      console.error("사이트 목록을 불러오는 데 실패했습니다:", error);
    }
  }, [registeredCampgroundId]);
  
  // ★ 페이지가 처음 로드될 때, 사용자의 캠핑장 정보를 조회
  useEffect(() => {
    const fetchMyCampsite = async () => {
      try {
        const response = await axios.get("/web/api/staff/register/my-campsite");
        if (response.data) {
          setInitialCampsiteData(response.data);
          setRegisteredCampgroundId(response.data.campgroundId);
        }
      } catch (error) {
        console.error("캠핑장 정보를 불러오는 데 실패했습니다:", error);
      }
    };
    fetchMyCampsite();
  }, []);
  
  // ★ 캠핑장 등록 성공 시 호출될 함수
  const handleCampsiteSuccess = useCallback((newCampgroundId) => {
    alert(`캠핑장 등록 성공! (ID: ${newCampgroundId}) 이제 존을 등록해주세요.`);
    setRegisteredCampgroundId(newCampgroundId);
  }, []);
  
  // ★ 존 등록 성공 시 호출될 함수
  const handleZoneSuccess = useCallback(() => {
    alert("존이 등록되었습니다.");
    fetchZones(); // 존 목록만 새로고침
  }, [fetchZones]);
  
  // ★ 사이트 등록 성공 시 호출될 함수
  const handleSiteSuccess = useCallback(() => {
    alert("사이트가 등록되었습니다.");
    fetchSites(); // 사이트 목록만 새로고침
  }, [fetchSites]);
  
  // ★ registeredCampgroundId가 변경될 때마다 실행
  useEffect(() => {
    if (registeredCampgroundId) {
      fetchZones();
      fetchSites();
    }
  }, [registeredCampgroundId, fetchZones, fetchSites]);

  // ★ 존 삭제
  const handleDeleteZone = useCallback(async (zoneId) => {
      const result = await Swal.fire({
        title: `존(ID: ${zoneId})을 삭제하시겠습니까?`,
        text: "이 작업은 되돌릴 수 없으며, 존에 속한 모든 사이트도 함께 삭제됩니다.",
        icon: 'warning',
        showCancelButton: true,
        iconColor: '#8C06AD',
        confirmButtonColor: '#8C06AD',
        cancelButtonColor: '#E5E5E5',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });

      if (result.isConfirmed) {
        try {
          // 확인 버튼 클릭 시, 삭제 API 호출
          await axios.delete(`/web/api/staff/register/zones/${zoneId}`);

          // 성공 팝업
          Swal.fire({
              title: '삭제 완료!',
              text: '해당 존과 포함된 사이트들이 삭제되었습니다.',
              icon: 'success'
          });
          
          fetchZones();
          fetchSites();
        } catch (error) {
          console.error("존 삭제 실패:", error);
          // 실패 팝업
          Swal.fire({
            title: '삭제 실패',
            text: '존 삭제 중 오류가 발생했습니다: ' + (error.response?.data || error.message),
            icon: 'error'
          });
        }
      }
    }, [fetchZones, fetchSites]);

    // ★ 사이트 삭제
    const handleDeleteSite = useCallback(async (siteId) => {
      const result = await Swal.fire({
        title: `사이트(ID: ${siteId})를 삭제하시겠습니까?`,
        text: "이 작업은 되돌릴 수 없습니다!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8C06AD',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`/web/api/staff/register/sites/${siteId}`);

          Swal.fire({
            title: '삭제 완료!',
            text: '사이트가 성공적으로 삭제되었습니다.',
            icon: 'success'
          });

          fetchSites();
        } catch (error) {
          console.error("사이트 삭제 실패:", error);
          Swal.fire({
            title: '삭제 실패',
            text: '사이트 삭제 중 오류가 발생했습니다: ' + (error.response?.data || error.message),
            icon: 'error'
          });
        }
      }
    }, [fetchSites]);
  
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
              <CampsiteInfoSection 
                initialData={initialCampsiteData} 
                onSuccess={handleCampsiteSuccess} 
              />
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
                  onSuccess={handleSiteSuccess}
                />
              </div>
            )}

            <div className="px-5 py-5 w-full rounded-md border border-cgray">
              <RegisteredItemsSection 
                zones={registeredZones}
                sites={registeredSites}
                onDeleteZone={handleDeleteZone}
                onDeleteSite={handleDeleteSite}
              />
            </div>
        </div>
      </div>
    </section>
  );
}
