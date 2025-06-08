import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../utils/Auth.jsx";
import MPSidebar from "../../components/MyPage/UI/MP_SideBar.jsx";
import MPHeader from "../../components/MyPage/UI/MP_Header.jsx";
import DateRangeSelector from "../../components/MyPage/UI/MP_DateRangeSelector.jsx";
import LocationInput from "../../components/MyPage/UI/MP_LocationInput.jsx";
import StarRating from "../../components/Common/StarRating.jsx";
import PhotoUploader from "../../components/MyPage/UI/MP_PhotoUploader.jsx";
import ReviewTextArea from "../../components/MyPage/UI/MP_ReviewTextArea.jsx";
import SubmitButton from "../../components/MyPage/UI/MP_SubmitButton.jsx";
import FormField from "../../components/MyPage/UI/MP_FormField.jsx";
import Button from "../../components/Common/Button.jsx";
import BasicAlert from "../../utils/BasicAlert";


export default function ReviewWritePage() {
  const { user: userInfo, isAuthenticated, isLoading } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const isSubmitDisabled = reviewText.trim().length < 30;
  const [showAlert, setShowAlert] = useState(false);

  // 로딩 상태를 위한 state 추가
  const [isWaitingForResult, setIsWaitingForResult] = useState(true);

  const selectedReservation = reservations.find(r => r.reservationId === selectedId);
  
  useEffect(() => {
    if (isAuthenticated) {
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
      }). finally(() => {
        setIsWaitingForResult(false);
      })
    }
  }, [isAuthenticated]);

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

    if(isSubmitDisabled) {
      alert('내용을 30자 이상 입력해주세요.');
      return;
    }

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
      // 리뷰 등록 성공 후 목록을 다시 불러오는 로직
      setIsWaitingForResult(true);
      axios.get("/web/api/reviews/available")
        .then(res => setReservations(Array.isArray(res.data) ? res.data : []))
        .catch(err => {
          console.error("리뷰 가능한 예약 재조회 실패:", err);
          setReservations([]);
        })
        .finally(() => { 
          setIsWaitingForResult(false)
        });
    } catch (err) {
      console.error('🚨 리뷰 등록 실패:', err.response ? err.response.data : err.message);
      alert(`리뷰 등록 실패: ${err.response ? err.response.data : err.message}`);
    }
  };

  // 상황에 따라 렌더링될 콘텐츠 결정
  const renderContent = () => {
    // 1. 리뷰 불러오는 중 - todo : 추가예정
    if (isWaitingForResult) {
      <div class="w-20 mx-auto mt-24 flex flex-wrap gap-2">
        {/* 로딩 컴포넌트 */}
      </div>
    }

    // 2. 작성 가능한 리뷰가 '없는' 경우
    if (reservations.length === 0) {
      return (
        <div className="flex flex-col gap-3 items-center justify-center text-center w-full mt-15">
          <p className="text-lg text-gray-500 select-none">아직 리뷰를 작성할 수 있는 상품이 없습니다.</p>
          <p className="text-sm text-gray-400 select-none">마음에 드는 상품을 구매하고 후기를 남겨보세요!</p>
        </div>
      );
    }

    // 3. 1과 2에 해당하지 않는 경우 => 작성 가능한 리뷰가 '있는' 경우
    return (
      <>
        <p className="text-gray-600 mb-8">생생한 방문 후기를 남겨주세요!</p>
        <form onSubmit={handleSubmitReview} className="flex flex-col w-full space-y-6 bg-white p-8 rounded-xl border border-gray-300">
          <div>
            <LocationInput 
              reservations={reservations}
              selectedReservationId={selectedId} 
              onChangeReservation={setSelectedId} 
            />
          </div>

          {/* 리뷰 작성할 캠핑장 선택 시 활성화, 그 외 비활성화 */}
          <div className="relative space-y-6">
            {!selectedId && (
              <div
                className="absolute top-0 left-0 w-full h-full z-10"
                onClick={() => setShowAlert(true)} 
              />
            )}
            <div className={`space-y-6 ${!selectedId ? 'opacity-50' : ''}`}></div>
              <div>
                <DateRangeSelector 
                  reservationDate={selectedReservation?.reservationDate}
                  endDate={selectedReservation?.endDate}
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
                {/* 글자 수 카운터 */}
                <p className={`pr-5 text-end text-xs select-none ${isSubmitDisabled ? 'text-red-500' : 'text-gray-400'}`}>
                  {reviewText.trim().length} 자
                </p>
              </div>
          </div>

          <div className="flex flex-col justify-end">
            <Button type="submit" className = {`text-white w-full bg-cpurple ${ isSubmitDisabled ? 'opacity-30 cursor-not-allowed' : '' }`} disabled={isSubmitDisabled}>작성 완료</Button>
          </div>
        </form>
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <MPHeader />
      <div className="flex flex-1">
        
        {/* 왼쪽 사이드바: 고정 너비 */}
        <div className="w-64">
          <MPSidebar />
        </div>

        {/* 오른쪽 콘텐츠: 남은 영역 모두 차지 */}
        <main className="flex-1 px-8 py-10 max-w-4xl mx-auto overflow-auto">
          {showAlert && (
            <BasicAlert
              severity="warning"
              onClose={() => setShowAlert(false)} 
            >
              리뷰를 작성할 장소를 먼저 선택해주세요.
            </BasicAlert>
          )}
          
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 select-none">리뷰 작성</h2>
          {/* 상황에 따라 다른 콘텐츠 렌더링 */}
          {renderContent()}
        </main>

      </div>
    </div>
  );
}
