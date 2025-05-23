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

  // 선택한 객실 상태 추가
  const [selectedRoom, setSelectedRoom] = useState("");
  const [guestInfo, setGuestInfo] = useState({
    userName: '',
    userPhone: '',
    email: '',
    
  });

  if (!reservationData) {
    return <p>⛔ 예약 정보가 없습니다. 다시 선택해주세요.</p>;
  }

  // 결제 페이지로 이동 (선택한 객실까지 넘기기)
  const goToPayment = () => {
    navigate("/payment", {
      state: {
        ...reservationData,
        selectedRoom,
        guestInfo,
      },
    });
  };

  return (
    <main className="flex flex-col gap-8 items-center mx-auto my-0 bg-white h-[1315px] w-[1440px] max-md:w-full max-md:max-w-screen-lg">
      <Header showSearchBar={false}/>
      <section className="flex flex-col gap-3 items-center px-5 py-8 bg-white w-[1290px] max-md:p-5 max-md:w-full max-md:max-w-[900px] max-sm:p-4">

        {/* 예약 정보 표시 */}
        <ProductInfo {...reservationData} />

        {/* 객실 선택 (rooms 배열은 reservationData에 포함되어 있어야 함) */}
        <RoomSelector
          rooms={reservationData.rooms}
          onChange={(room) => setSelectedRoom(room)}
        />

        <GuestInfoForm onChange={setGuestInfo} />

        <CancellationPolicy />

        {/* 선택한 가격 넘김 */}
        <BookingButton onClick={goToPayment} price={reservationData.price} />
      </section>
    </main>
  );
};

export default ReservationPage;
