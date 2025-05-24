import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../../Common/Button';

const PaymentCompletionForm = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const name = params.get('name') || '이름 정보 없음';
  const camp = params.get('camp') || '캠핑장 정보 없음';
  const site = params.get('site') || '사이트 정보 없음';
  const checkin = params.get('checkin') || '입실일 정보 없음';
  const checkout = params.get('checkout') || '퇴실일 정보 없음';
  const contact = params.get('contact') || '연락처 정보 없음';
  const price = params.get('price');
  const formattedPrice = isNaN(price) ? '0' : parseInt(price).toLocaleString();

  return (
    <section className="flex flex-col gap-2 items-start px-0 py-2.5 h-[800px] w-[1204px] max-md:w-full max-md:h-auto">
      <h1 className="px-0 pt-1 pb-1 text-3xl font-bold text-center text-neutral-900 w-[1204px] max-md:w-full max-md:text-2xl max-sm:text-xl">
        결제 완료
      </h1>

      <h2 className="self-stretch px-0 pt-px pb-1 text-base font-bold text-neutral-900 max-sm:text-sm">
        결제 정보
      </h2>
      <div className="flex flex-col shrink-0 gap-1 items-start self-stretch px-4 pt-4 pb-5 bg-white rounded-md border border-purple-200 border-solid h-auto max-sm:p-3">
        <p className="text-base text-zinc-800 max-sm:text-sm">
          예약자: {name} 
        </p>
        <p className="text-base text-zinc-800 max-sm:text-sm">캠핑장: {camp}</p>
        <p className="text-base text-zinc-800 max-sm:text-sm">캠핑사이트: {site}</p>
        <p className="text-base text-zinc-800 max-sm:text-sm">입실일: {checkin}</p>
        <p className="text-base text-zinc-800 max-sm:text-sm">퇴실일: {checkout}</p>
        <p className="text-base text-zinc-800 max-sm:text-sm">캠핑장 연락처: {contact}</p>
        <p className="text-base text-zinc-800 max-sm:text-sm">결제 금액: {formattedPrice}원</p>
      </div>

      <div className="gap-2.5 self-stretch p-2.5 h-auto text-base bg-purple-200 rounded-xl text-zinc-800 max-sm:p-2 max-sm:text-sm">
        ⭐ 캠핑 짐 싸기, 이제 걱정 끝! AI가 알아서 척척, 맞춤형 체크리스트를 준비해 드립니다. [나의 예약] 페이지에서 '체크리스트 보기'를 클릭해 보세요.
      </div>

      <Button>나의 예약으로 가기</Button>
      <Button>메인페이지로 가기</Button>
    </section>
  );
};

export default PaymentCompletionForm;
