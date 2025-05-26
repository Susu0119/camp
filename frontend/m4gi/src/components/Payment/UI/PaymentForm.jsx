import React from "react";
import InfoSection from "./InfoSection";
import PaymentSummary from "./PaymentSummary";

const PaymentForm = ({ reservation, setReservation }) => {
  if (!reservation) {
    return <p>⛔ 예약 정보가 없습니다. 다시 시도해주세요.</p>;
  }

  const {
    userName,
    campgroundName,
    address,
    phone,
    siteName,
    checkinDate,
    checkoutDate,
    price,
    selectedRoom,
  } = reservation;

  return (
    <article className="px-6 py-11 mt-24 max-w-full bg-white rounded-2xl border-2 border-solid shadow-sm border-[color:var(--unnamed,#8C06AD)] min-h-[664px] text-neutral-900 w-[1252px] max-md:px-5 max-md:mt-10">
      <h2 className="pt-1 pb-1 w-full text-3xl font-bold text-center">
        결제 정보
      </h2>

      {/* 캠핑장 정보 */}
      <InfoSection title="캠핑지">
        <p className="text-base font-semibold">{campgroundName}</p>
        <p className="text-base">{address}</p>
        <p className="text-base">{phone}</p>
      </InfoSection>

      {/* 상품 정보 */}
      <InfoSection title="상품 내역">
        <p className="text-base">
          {selectedRoom?.name || siteName}
          <br />
          {checkinDate} ~ {checkoutDate}
          <br />
          {price?.toLocaleString()}원
        </p>
      </InfoSection>

      {/* 결제 수단 */}
      <InfoSection title="결제 수단">
        <p className="text-base">카카오페이</p>
        <p className="mt-1 text-base">(결제 버튼 클릭 시 연동)</p>
      </InfoSection>

      {/* ✅ 결제 총 금액 및 결제 버튼 */}
      <PaymentSummary reservation={reservation} setReservation={setReservation} />
    </article>
  );
};

export default PaymentForm;
