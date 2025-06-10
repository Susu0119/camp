import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import axios from "axios";
import MPSidebar from "../../components/MyPage/UI/MP_SideBar.jsx";
import Header from "../../components/Common/Header.jsx";
import DateRangeSelector from "../../components/MyPage/UI/MP_DateRangeSelector.jsx";
import LocationInput from "../../components/MyPage/UI/MP_LocationInput.jsx";
import StarRating from "../../components/Common/StarRating.jsx";
import PhotoUploader from "../../components/MyPage/UI/MP_PhotoUploader.jsx";
import ReviewTextArea from "../../components/MyPage/UI/MP_ReviewTextArea.jsx";
import SubmitButton from "../../components/MyPage/UI/MP_SubmitButton.jsx";
import FormField from "../../components/MyPage/UI/MP_FormField.jsx";
import Button from "../../components/Common/Button.jsx";

export default function ReviewWritePage() {
  const [reservations, setReservations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const selectedReservation = reservations.find(r => r.reservationId === selectedId);
  
  useEffect(() => {
    axios.get("/web/api/reviews/available")
    .then((res) => {
      console.log('API 응답 데이터:', res.data);
      console.log('res.data가 배열인가?:', Array.isArray(res.data));
      if (Array.isArray(res.data)) {
        setReservations(res.data);
      } else {
        setReservations([]);
      }
    }).catch((err) => {
      console.error("리뷰 가능한 예약 조회 실패: ", err);
      setReservations([]);
    })
  }, []);

  // PhotoUploader로부터 완료된 URL 목록을 받는 콜백 함수
  const handlePhotoUploadComplete = useCallback((urls) => {
    console.log('📸 최종 업로드된 사진 URL 목록 (부모):', urls);
    setUploadedPhotoUrls(currentUrls => {
      if (JSON.stringify(currentUrls) !== JSON.stringify(urls)) {
        console.log('📸 부모: uploadedPhotoUrls 상태 업데이트 실행:', urls);
        return urls;
      }
      console.log('📸 부모: uploadedPhotoUrls 변경 없음, 상태 유지:', currentUrls);
      return currentUrls;
    });
  }, []);

  // 리뷰 저장 핸들러
  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if(!selectedId) {
      alert("리뷰를 작성할 예약 건을 선택해주세요"); // Todo : 수정 예정
      return;
    }

    console.log('📬 MyPage_Review_WritePage: handleSubmitReview 시작 시 uploadedPhotoUrls:', uploadedPhotoUrls);

    const formData = new FormData();
    formData.append("campgroundId", selectedReservation.campgroundId);
    formData.append("reviewContent", reviewText);
    formData.append("reviewRating", rating);
    formData.append("reservationId", selectedId);

    const photoData = {
      photo_urls: uploadedPhotoUrls || []
    };
    formData.append("photoUrlsJson", JSON.stringify(photoData));

    // 🔍 FormData 내용 확인 (개발 중 디버깅용)
    console.log("--- 🚀 FormData 전송 직전 데이터 ---");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log("---------------------------------");

    try {
      const response = await axios.post("/web/api/reviews/write", formData);
      console.log("리뷰 등록 성공", response.data);
      alert("리뷰가 성공적으로 등록되었습니다!");
      setSelectedId("");
      setReviewText("");
      setRating(0);
      setUploadedPhotoUrls([]);
    } catch (err) {
      console.error('🚨 리뷰 등록 실패:', err.response ? err.response.data : err.message);
      alert(`리뷰 등록 실패: ${err.response ? err.response.data : err.message}`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white"> {/* 전체 배경 흰색 */}
      
      {/* 상단 헤더: 고정 높이 */}
      <Header showSearchBar={false} />

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

         <form onSubmit={handleSubmitReview} className="flex flex-col w-full space-y-6 bg-white p-8 rounded-xl border border-gray-300">
          <div>
            <DateRangeSelector 
              reservationDate={selectedReservation?.reservationDate}
              endDate={selectedReservation?.endDate}
            />
          </div>

          <div>
            <LocationInput 
              reservations={reservations}
              selectedReservationId={selectedId} 
              onChangeReservation={setSelectedId} 
            />
          </div>

          <div>
            <FormField label="평점 선택" labelClassName="text-left w-full">
              <div className="w-full border border-gray-300 rounded-md p-2 mt-1 flex justify-center">
                <StarRating rating={rating} onRate={setRating} />
              </div>
            </FormField>
          </div>

          <div>
            <PhotoUploader onUploadComplete={handlePhotoUploadComplete} />
          </div>

          <div>
            <ReviewTextArea value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className = "bg-cpurple text-white w-full">작성 완료</Button>
          </div>
        </form>

        </main>
      </div>
    </div>
  );
}
