import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../Common/Button';

const PaymentCompletionForm = () => {
  const { state } = useLocation();   // navigate 로 전달된 모든 값
  const navigate = useNavigate();

  // === 전달받은 값 매핑 ===
  const nickname      = state?.userName       ?? '이름 정보 없음';
  const campground    = state?.campgroundName ?? '캠핑장 정보 없음';
  const siteName      = state?.siteName       ?? '사이트 정보 없음';

  // 날짜·시간
  const startDate     = state?.startDate      ?? '입실일 정보 없음';
  const endDate       = state?.endDate        ?? '퇴실일 정보 없음';
  
  const extractTime = (datetimeStr) => {
    return datetimeStr?.split('T')[1]?.slice(0, 5) ?? ''; // "16:00"
  };

  const checkinTime = extractTime(state?.checkinTime);
  const checkoutTime = extractTime(state?.checkoutTime);

  // 연락처·금액
  const contact       = state?.phone          ?? '연락처 정보 없음';
  const price         = Number(state?.price) || 0;
  const formattedPrice = price.toLocaleString();

  return (
    <section className="flex flex-col gap-2 items-start px-0 py-2.5 w-full max-w-[1204px]">
      <h1 className="text-3xl font-bold text-center w-full">결제 완료</h1>

      <h2 className="text-base font-bold">결제 정보</h2>
      <div className="bg-white border border-purple-200 rounded-md p-4 w-full space-y-1">
        <p>예약자: {nickname}</p>
        <p>캠핑장: {campground}</p>
        <p>캠핑사이트: {siteName}</p>

        <p>입실일: {startDate}</p>
        <p>입실시간: {checkinTime}</p>

        <p>퇴실일: {endDate}</p>
        <p>퇴실시간: {checkoutTime}</p>

        <p>캠핑장 연락처: {contact}</p>
        <p>결제 금액: {formattedPrice}원</p>
      </div>

      <div className="p-2.5 w-full text-base bg-purple-200 rounded-xl text-zinc-800">
        ⭐ 캠핑 짐 싸기, 이제 걱정 끝! <b>[나의 예약]</b>에서 체크리스트 확인해보세요.
      </div>

      <Button
        className="w-full h-12 px-6 text-base bg-[#8C06AD] text-white font-bold rounded-md"
        onClick={() => navigate('/mypage/reservations')}
      >
        나의 예약으로 가기
      </Button>

      <Button
        className="w-full h-12 px-6 text-base bg-[#8C06AD] text-white font-bold rounded-md"
        onClick={() => navigate('/main')}
      >
        메인페이지로 가기
      </Button>
    </section>
  );
};

export default PaymentCompletionForm;
