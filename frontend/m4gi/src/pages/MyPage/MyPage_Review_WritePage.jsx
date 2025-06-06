import React from "react";
import MPSidebar from "../../components/MyPage/UI/MP_SideBar.jsx";
import MPHeader from "../../components/MyPage/UI/MP_Header.jsx";
import DateRangeSelector from "../../components/MyPage/UI/MP_DateRangeSelector.jsx";
import LocationInput from "../../components/MyPage/UI/MP_LocationInput.jsx";
import RatingSelector from "../../components/MyPage/UI/MP_RatingSelector.jsx";
import PhotoUploader from "../../components/MyPage/UI/MP_PhotoUploader.jsx";
import ReviewTextArea from "../../components/MyPage/UI/MP_ReviewTextArea.jsx";
import SubmitButton from "../../components/MyPage/UI/MP_SubmitButton.jsx";

export default function ReviewWritePage() {
  return (
    <div className="h-screen flex flex-col bg-white"> {/* 전체 배경 흰색 */}
      
      {/* 상단 헤더: 고정 높이 */}
      <MPHeader />

      {/* 헤더 아래 영역: 사이드바 + 콘텐츠 좌우 배치 */}
      <div className="flex flex-1">
        
        {/* 왼쪽 사이드바: 고정 너비 */}
        <div className="w-64"> {/* 16 * 4 = 64 (Tailwind 기본 단위) */}
          <MPSidebar />
        </div>

        {/* 오른쪽 콘텐츠: 남은 영역 모두 차지 */}
        <main className="flex-1 px-8 py-10 max-w-4xl mx-auto overflow-auto">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">리뷰 작성</h2>
          <p className="text-gray-600 mb-8">생생한 방문 후기를 남겨주세요!</p>

         <form className="flex flex-col w-full space-y-6 bg-white p-8 rounded-xl border border-gray-300">
          <div>
            <DateRangeSelector />
          </div>

          <div>
            <LocationInput />
          </div>

          <div>
            <RatingSelector />
          </div>

          <div>
            <PhotoUploader />
          </div>

          <div>
            <ReviewTextArea />
          </div>

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>

        </main>
      </div>
    </div>
  );
}
