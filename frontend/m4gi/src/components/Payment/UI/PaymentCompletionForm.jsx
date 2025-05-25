import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../Common/Button';

const PaymentCompletionForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const name = state?.userName || '이름 정보 없음';
  const camp = state?.campgroundName || '캠핑장 정보 없음';
  const site = state?.siteName || '사이트 정보 없음';
  const checkin = state?.checkinDate || '입실일 정보 없음';
  const checkout = state?.checkoutDate || '퇴실일 정보 없음';
  const contact = state?.phone || '연락처 정보 없음';
  const price = state?.price;
  const formattedPrice = isNaN(price) ? '0' : parseInt(price).toLocaleString();

  return (
    <section className="flex flex-col gap-2 items-start px-0 py-2.5 h-auto w-full max-w-[1204px]">
      <h1 className="text-3xl font-bold text-center w-full">결제 완료</h1>
      <h2 className="text-base font-bold">결제 정보</h2>
      <div className="bg-white border border-purple-200 rounded-md p-4 w-full space-y-1">
        <p>예약자: {name}</p>
        <p>캠핑장: {camp}</p>
        <p>캠핑사이트: {site}</p>
        <p>입실일: {checkin}</p>
        <p>퇴실일: {checkout}</p>
        <p>캠핑장 연락처: {contact}</p>
        <p>결제 금액: {formattedPrice}원</p>
      </div>
      <div className="gap-2.5 self-stretch p-2.5 h-auto text-base bg-purple-200 rounded-xl text-zinc-800 max-sm:p-2 max-sm:text-sm">
        ⭐ 캠핑 짐 싸기, 이제 걱정 끝! [나의 예약]에서 체크리스트 확인해보세요. 
      </div>
      <Button onClick={() => navigate('/my-reservations')}>나의 예약으로 가기</Button>
      <Button onClick={() => navigate('/')}>메인페이지로 가기</Button>
    </section>
  );
};

export default PaymentCompletionForm;
