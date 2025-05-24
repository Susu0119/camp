import React from "react";
import InfoSection from "./InfoSection";
import PaymentSummary from "./PaymentSummary";

const PaymentForm = ({ reservation }) => {
  if (!reservation) {
    return <p>⛔ 예약 정보가 없습니다. 다시 시도해주세요.</p>;
  }

  const {
    campgroundName,
    address,
    phone,
    siteName,
    checkinDate,
    checkoutDate,
    price,
    selectedRoom,
    userName,
  } = reservation;

  return (
    <article className="px-6 py-11 mt-24 max-w-full bg-white rounded-2xl border-2 border-solid shadow-sm border-[color:var(--unnamed,#8C06AD)] min-h-[664px] text-neutral-900 w-[1252px] max-md:px-5 max-md:mt-10">
      <h2 className="pt-1 pb-1 w-full text-3xl font-bold text-center">
        결제 정보
      </h2>

      <InfoSection title="캠핑지">
        <p className="text-base">{userName}</p>
        <p className="text-base">{campgroundName}</p>
        <address className="mt-1 text-base not-italic">
          <p className="text-base">{address}</p>
          <br />
          <p className="text-base">{phone}</p>
        </address>
      </InfoSection>

      <InfoSection title="상품 내역">
        <p className="text-base">
          {selectedRoom || siteName} 
          <br />
          {checkinDate} ~ {checkoutDate}
          <br />
          {price?.toLocaleString()}원
        </p>
      </InfoSection>

      <InfoSection title="결제 수단">
        <p className="text-base">카카오페이</p>
        <p className="mt-1 text-base">(결제 버튼 클릭 시 연동)</p>
      </InfoSection>

      {/* ✅ 결제 summary에 reservation 넘기기 */}
      <PaymentSummary reservation={reservation} />
    </article>
  );
};

export default PaymentForm;
