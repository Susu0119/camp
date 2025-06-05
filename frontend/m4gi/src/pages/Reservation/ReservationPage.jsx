"use client";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, apiCore } from '../../utils/Auth';

import Header from '../../components/Common/Header';
import ProductInfo from '../../components/Reservation/UI/ProductInfo';
import CancellationPolicy from '../../components/Reservation/UI/CancellationPolicy';
import BookingButton from '../../components/Reservation/UI/BookingButton';
import NavigationBar from '../../components/Common/NavigationBar';

export default function ReservationPage() {
  const { state: reservationData } = useLocation();
  
  const navigate = useNavigate();
  const { user: userInfo, isAuthenticated, isLoading } = useAuth();

  const [selectedRoom, setSelectedRoom] = useState("");
  const [campground, setCampground] = useState(null);
  

  // ✅ 단일 사이트 정보 불러오기
  useEffect(() => {
    if (!reservationData?.siteId) return;

    apiCore.get(`/api/sites/byId?siteId=${reservationData.siteId}`)
      .then(res => {
        console.log("✅ 단일 사이트 정보:", res.data);
        setSelectedRoom(res.data);
      })
      .catch(err => {
        console.error("❌ 사이트 정보 불러오기 실패:", err);
        alert("객실 정보를 불러올 수 없습니다.");
      });
  }, [reservationData]);

  // ✅ 캠핑장 정보 불러오기
  useEffect(() => {
    if (!reservationData?.campgroundId) return;

    apiCore.get(`/api/campgrounds/byId?campgroundId=${reservationData.campgroundId}`)
      .then(res => {
        console.log("✅ 캠핑장 정보:", res.data);
        setCampground(res.data);
      })
      .catch(err => {
        console.error("❌ 캠핑장 정보 불러오기 실패:", err);
        alert("캠핑장 정보를 불러올 수 없습니다.");
      });
  }, [reservationData]);

  // ✅ 유효성 검사
  if (!reservationData) {
    return <p>⛔ 예약 정보가 없습니다. 다시 선택해주세요.</p>;
  }

  // 인증 로딩 중이거나 사용자 정보가 없거나 캠핑장 정보가 없는 경우
  if (isLoading || !isAuthenticated || !userInfo || !campground) {
    return <p>⏳ 데이터를 불러오는 중입니다...</p>;
  }
  
  console.log("💬 예약 데이터 price 확인:", reservationData?.price);


  // ✅ 결제 페이지로 이동
  const goToPayment = () => {

  

    navigate("/payment", {
      state: {
        ...reservationData,
        selectedRoom: {
          ...selectedRoom,
          site_id: selectedRoom.siteId || selectedRoom.site_id || selectedRoom,
          name: selectedRoom.siteName || selectedRoom.name,
        },
        userName: userInfo.nickname,
        phone: userInfo.phone,
        email: userInfo.email,
        campgroundName: campground.campgroundName,
        checkinTime: campground.checkinTime,
        checkoutTime: campground.checkoutTime,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearchBar={false} />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* 페이지 타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">예약 확인</h1>
          <p className="text-gray-600">예약 정보를 확인하고 결제를 진행해 주세요</p>
        </div>

        {/* 캠핑장 상품 정보 */}
        <ProductInfo
          campgroundName={campground.campgroundName}
          siteName={selectedRoom.siteName}
          address={campground.address}
          phone={campground.phone}
          checkinTime={campground.checkinTime}
          checkoutTime={campground.checkoutTime}
          startDate={reservationData.startDate}
          endDate={reservationData.endDate}
          price={reservationData.price}
        />

        {/* 예약자 정보 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r bg-cpurple px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              예약자 정보
            </h2>
          </div>

          {/* 컨텐츠 */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">예약자명</p>
                  <p className="text-gray-900 font-semibold">{userInfo.nickname}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">연락처</p>
                  <p className="text-gray-900 font-semibold">{userInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">이메일</p>
                  <p className="text-gray-900 font-semibold">{userInfo.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 취소 정책 */}
        <CancellationPolicy />

        {/* 예약 버튼 */}
        <div className="sticky bottom-4">
          <BookingButton onClick={goToPayment} price={reservationData.price} />
        </div>
      </div>

      <NavigationBar />
    </div>
  );
};
