import React from "react";
import PaymentSummary from "./PaymentSummary";

const PaymentForm = ({ reservation, setReservation, onPaymentSuccess }) => {
  if (!reservation) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-gray-600">예약 정보가 없습니다. 다시 시도해주세요.</p>
      </div>
    );
  }

  const {
    campgroundName,
    address,
    siteName,
    startDate,
    endDate,
    price,
    totalPrice,
    priceBreakdown,
    selectedRoom,
  } = reservation;

  return (
    <div className="space-y-6">
      {/* 캠핑장 정보 카드 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-cpurple px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            캠핑장 정보
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-clpurple rounded-lg flex items-center justify-center">
              <img src="https://storage.googleapis.com/m4gi/images/campground.svg" alt="캠핑장" className="w-6 h-6  " />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{campgroundName}</p>
              <p className="text-sm text-gray-600">{address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 예약 상품 정보 카드 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-cpurple px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            예약 상품 내역
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 font-medium">사이트명</p>
                <p className="text-lg font-semibold text-gray-900">{selectedRoom?.name || siteName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">이용 기간</p>
                <p className="text-gray-900 font-semibold">{startDate} ~ {endDate}</p>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">상품 금액</p>
                <p className="text-2xl font-bold text-cpurple">{(totalPrice || price)?.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 가격 세부 내역 */}
      {priceBreakdown && priceBreakdown.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-cpurple px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              요금 계산 내역
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {priceBreakdown.map((day, index) => (
                <div key={index} className={`flex justify-between items-center py-2 ${index < priceBreakdown.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">
                      {day.date} ({day.dayOfWeek})
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      day.isPeakSeason 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {day.priceType}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₩{day.price.toLocaleString()}
                  </span>
                </div>
              ))}
              
              <div className="pt-4 border-t-2 border-cpurple">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    총 {priceBreakdown.length}박 요금
                  </span>
                  <span className="text-xl font-bold text-cpurple">
                    ₩{(totalPrice || price).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 결제 수단 카드 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-cpurple px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            결제 수단
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <img src="https://storage.googleapis.com/m4gi/images/kakao.svg" alt="카카오페이" className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">카카오페이</p>
              <p className="text-sm text-gray-600">결제 버튼 클릭 시 카카오페이로 연결됩니다</p>
            </div>
          </div>
        </div>
      </div>

      {/* 결제 총 금액 및 결제 버튼 */}
      <PaymentSummary
        reservation={reservation}
        setReservation={setReservation}
        onPaymentSuccess={onPaymentSuccess}
      />
    </div>
  );
};

export default PaymentForm;
