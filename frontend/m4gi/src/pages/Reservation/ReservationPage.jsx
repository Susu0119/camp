"use client";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

import Header from '../../components/Common/Header';
import ProductInfo from '../../components/Reservation/UI/ProductInfo';
import CancellationPolicy from '../../components/Reservation/UI/CancellationPolicy';
import BookingButton from '../../components/Reservation/UI/BookingButton';

const ReservationPage = () => {
  const { state: reservationData } = useLocation();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [campground, setCampground] = useState(null);

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    axios.get("/web/api/users/me", { withCredentials: true })
      .then(res => {
        console.log("✅ 사용자 정보:", res.data);
        setUserInfo(res.data);
      })
      .catch(err => {
        console.error("❌ 사용자 정보 불러오기 실패:", err);
        alert("사용자 정보를 불러올 수 없습니다.");
      });
  }, []);

  // ✅ 단일 사이트 정보 불러오기
  useEffect(() => {
    if (!reservationData?.siteId) return;

    axios.get(`/web/api/sites/byId?siteId=${reservationData.siteId}`)
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

    axios.get(`/web/api/campgrounds/byId?campgroundId=${reservationData.campgroundId}`)
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

  if (!reservationData || !userInfo || !campground) {
    return <p>⏳ 데이터를 불러오는 중입니다...</p>;
  }

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
    <main className="flex flex-col gap-8 items-center mx-auto my-0 bg-white h-[1315px] w-[1440px] max-md:w-full max-md:max-w-screen-lg">
      <Header showSearchBar={false} />

      <section className="flex flex-col gap-3 items-center px-5 py-8 bg-white w-[1290px] max-md:p-5 max-md:w-full max-md:max-w-[900px] max-sm:p-4">
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
        <div className="w-full px-3 py-4 bg-gray-50 border rounded">
          <p><strong>예약자 이름:</strong> {userInfo.nickname}</p>
          <p><strong>전화번호:</strong> {userInfo.phone}</p>
          <p><strong>이메일:</strong> {userInfo.email}</p>
        </div>

        {/* 취소 정책 */}
        <CancellationPolicy />

        {/* 예약 버튼 */}
        <BookingButton onClick={goToPayment} price={reservationData.price} />
      </section>
    </main>
  );
};

export default ReservationPage;
