"use client";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Common/Header";
import PaymentForm from "../../components/Payment/UI/PaymentForm";
import NavigationBar from "../../components/Common/NavigationBar";
import PaymentCompletionModal from "../../components/Payment/UI/PaymentCompletionModal";

const PaymentPage = () => {
  const { state: reservationData } = useLocation(); // 예약 정보 받기

  // ✅ 상태로 reservation 저장 및 수정 가능하게 설정
  const [reservation, setReservation] = useState(null);

  // ✅ 결제 완료 모달 상태
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [paymentCompletionData, setPaymentCompletionData] = useState(null);

  // ✅ 최초 reservationData 있을 때만 상태에 저장
  useEffect(() => {
    if (reservationData) {
      setReservation(reservationData);
    }
  }, [reservationData]);

  // ✅ 결제 완료 처리 함수
  const handlePaymentSuccess = (completionData) => {
    setPaymentCompletionData(completionData);
    setIsPaymentCompleted(true);
  };

  // ✅ 모달 닫기 함수
  const handleCloseModal = () => {
    setIsPaymentCompleted(false);
    setPaymentCompletionData(null);
  };

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">결제 정보 없음</h2>
            <p className="text-gray-600 mb-4">결제할 예약 정보가 없습니다.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-cpurple text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              이전 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearchBar={false} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 페이지 타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제하기</h1>
          <p className="text-gray-600">예약 정보를 확인하고 안전하게 결제해 주세요</p>
        </div>

        <PaymentForm
          reservation={reservation}
          setReservation={setReservation}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>

      <NavigationBar />

      {/* 결제 완료 모달 */}
      <PaymentCompletionModal
        isOpen={isPaymentCompleted}
        onClose={handleCloseModal}
        paymentData={paymentCompletionData}
      />
    </div>
  );
};

export default PaymentPage;