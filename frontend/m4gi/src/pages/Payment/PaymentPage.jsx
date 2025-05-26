"use client";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Common/Header";
import PaymentForm from "../../components/Payment/UI/PaymentForm";

const PaymentPage = () => {
  const { state: reservationData } = useLocation(); // 예약 정보 받기

  // ✅ 상태로 reservation 저장 및 수정 가능하게 설정
  const [reservation, setReservation] = useState(null);

  // ✅ 최초 reservationData 있을 때만 상태에 저장
  useEffect(() => {
    if (reservationData) {
      setReservation(reservationData);
    }
  }, [reservationData]);

  if (!reservation) {
    return <p>⛔ 결제할 예약 정보가 없습니다. 다시 예약해주세요.</p>;
  }

  return (
    <main className="flex overflow-hidden flex-col items-center">
      <Header showSearchBar={false} />
      <PaymentForm reservation={reservation} setReservation={setReservation} />
    </main>
  );
};

export default PaymentPage;
