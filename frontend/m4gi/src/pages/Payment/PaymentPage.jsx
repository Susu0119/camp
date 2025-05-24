"use client";
import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Common/Header";
import PaymentForm from "../../components/Payment/UI/PaymentForm"

const PaymentPage = () => {
    const { state: reservationData } = useLocation(); // 예약 정보 받기

  if (!reservationData) {
    return <p>⛔ 결제할 예약 정보가 없습니다. 다시 예약해주세요.</p>;
  }


  return (
    <main className="flex overflow-hidden flex-col items-center">
      <Header showSearchBar={false}/>
      <PaymentForm reservation={reservationData}/>
    </main>
  );
};

export default PaymentPage;
