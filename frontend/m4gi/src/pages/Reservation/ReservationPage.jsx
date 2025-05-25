"use client";
import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Header from '../../components/Common/Header';
import ProductInfo from '../../components/Reservation/UI/ProductInfo';
import RoomSelector from '../../components/Reservation/UI/siteSelector';
import GuestInfoForm from '../../components/Reservation/UI/GuestInfoForm';
import CancellationPolicy from '../../components/Reservation/UI/CancellationPolicy';
import BookingButton from '../../components/Reservation/UI/BookingButton';

const ReservationPage = () => {
  const { state: reservationData } = useLocation();
  const navigate = useNavigate();

  // ✅ guestInfo는 반드시 초기값을 객체로 설정해야 함 (undefined ❌)
  const [guestInfo, setGuestInfo] = useState({
    userName: '',
    userPhone: '',
    email: '',
  });

  const [selectedRoom, setSelectedRoom] = useState("");

  if (!reservationData) {
    return <p>⛔ 예약 정보가 없습니다. 다시 선택해주세요.</p>;
  }

 
  const goToPayment = () => {
    console.log("📦 최신 guestInfo 상태 확인:", guestInfo);

    navigate("/payment", {
      state: {
        ...reservationData,
        selectedRoom,
        userName: guestInfo.userName,
        phone: guestInfo.userPhone,
        email: guestInfo.email,
      },
    });
  };

  return (
    <main className="flex flex-col gap-8 items-center mx-auto my-0 bg-white h-[1315px] w-[1440px] max-md:w-full max-md:max-w-screen-lg">
      <Header showSearchBar={false} />
      <section className="flex flex-col gap-3 items-center px-5 py-8 bg-white w-[1290px] max-md:p-5 max-md:w-full max-md:max-w-[900px] max-sm:p-4">

        {/* 캠핑장 상품 정보 */}
        <ProductInfo {...reservationData} />

        {/* 객실 선택 */}
        <RoomSelector
          rooms={reservationData.rooms}
          onChange={(room) => setSelectedRoom(room)}
        />

        {/* 예약자 입력 정보 */}
        <GuestInfoForm guestInfo={guestInfo} setGuestInfo={setGuestInfo} />

        <CancellationPolicy />

        {/* 예약 버튼 */}
        <BookingButton onClick={goToPayment} price={reservationData.price} />
      </section>
    </main>
  );
};

export default ReservationPage;
