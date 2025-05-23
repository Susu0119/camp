import React from "react";
import InfoSection from "./InfoSection";
import PaymentSummary from "./PaymentSummary";

const PaymentCard = () => {
  return (
    <article className="px-6 py-11 mt-24 max-w-full bg-white rounded-2xl border-2 border-solid shadow-sm border-[color:var(--unnamed,#8C06AD)] min-h-[664px] text-neutral-900 w-[1252px] max-md:px-5 max-md:mt-10">
      <h2 className="pt-1 pb-1 w-full text-3xl font-bold text-center">
        결제 정보
      </h2>

      <InfoSection title="캠핑지">
        <p className="text-base">김캠핑</p>
        <address className="mt-1 text-base not-italic">
          서울시 성동구 캠핑로 123
          <br />
          010-1234-5678
        </address>
      </InfoSection>

      <InfoSection title="상품 내역">
        <p className="text-base">
          글램핑 캠핑존 (1박)
          <br />
          2025.05.20 ~ 2025.05.21
          <br />
          89,000원
          <br />
          추가옵션
          <br />
          기본 인원 초과(1) : 10,000원
          <br />
          바베큐 세트(1) : 20,000원{" "}
        </p>
      </InfoSection>

      <InfoSection title="결제 수단">
        <p className="text-base">카카오페이 or 카드</p>
        <p className="mt-1 text-base">(결제 버튼 클릭 시 연동)</p>
      </InfoSection>

      <PaymentSummary />
    </article>
  );
};

export default PaymentCard;
