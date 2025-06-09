import React, { useState } from "react";
import CampsiteInfoSection from "./CampSiteInfoSection";
import ZoneRegistrationSection from "./ZoneRegistrationSection";
import SiteRegistrationSection from "./SiteRegistrationSection";
import RegisteredItemsSection from "./RegisteredItemsSection";

export default function RegistrationForm() {
  const [registeredCampgroundId, setRegisteredCampgroundId] = useState(null);

  const handleRegistrationSuccess = (newCampgroundId) => {
    alert(`캠핑장 등록 성공! (ID: ${newCampgroundId}) 이제 존을 등록해주세요.`);
    setRegisteredCampgroundId(newCampgroundId);
  };

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
            <div className="px-5 py-5 w-full rounded-md border border-cgray">
                <CampsiteInfoSection onSuccess={handleRegistrationSuccess} />
            </div>
            <div className="px-5 py-5 w-full rounded-md border border-cgray">
                <ZoneRegistrationSection campgroundId={registeredCampgroundId} />
            </div>
            <div className="px-5 py-5 w-full rounded-md border border-cgray">
                <SiteRegistrationSection />
            </div>
            <div className="px-5 py-5 w-full rounded-md border border-cgray">
                <RegisteredItemsSection />
            </div>
        </div>
      </div>
    </section>
  );
}
