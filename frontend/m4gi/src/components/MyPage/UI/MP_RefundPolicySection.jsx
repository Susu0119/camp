"use client";
import React, { useState } from "react";

const RefundPolicySection = () => {
  const [isAgreed, setIsAgreed] = useState(false);

  const toggleAgreement = () => {
    setIsAgreed(!isAgreed);
  };

  return (
    <section className="flex flex-col gap-3 items-start p-6 bg-white rounded-md border border-solid border-zinc-200 w-[612px] max-md:w-full max-sm:p-4 self-stretch ml-9 max-md:ml-4 max-sm:ml-0">
  <h2 className="text-2xl font-bold leading-5 text-black max-sm:text-lg">
    환불 규정
  </h2>

  <div className="flex flex-col gap-2 justify-center items-center self-stretch px-4 pt-2.5 pb-2.5 h-40 bg-white rounded-md border border-solid border-zinc-200">
  <p className="text-sm leading-5 text-center text-zinc-500 font-light w-full">
    이용일 기준 14일 전까지 취소 : 결제 금액의 전액 환불
  </p>
  <p className="text-sm leading-5 text-center text-zinc-500 font-light w-full">
    이용일 기준 7일 ~ 3일 전까지 취소 : 결제 금액의 50% 환불
  </p>
  <p className="text-sm leading-5 text-center text-zinc-500 font-light w-full">
    이용일 기준 3일 전 이후 취소 : 환불 불가
  </p>
  </div>

  <div className="gap-2 self-stretch px-4 pt-0 pb-2.5 text-sm text-center bg-white rounded-md h-[10px] text-stone-300 mb-5 font-light">
    ※ 환불은 취소 요청일로부터 최대 5영업일 이내에 처리됩니다. ※<br />
  </div>

<label className="flex gap-3 items-center self-stretch px-4 pt-0 pb-2.5 bg-white rounded-md h-[30px] cursor-pointer">
  <input
    type="checkbox"
    checked={isAgreed}
    onChange={toggleAgreement}
    className="w-5 h-5 accent-fuchsia-700"
  />
  <span className="text-sm text-center text-fuchsia-700 font-light">
    취소/환불 규정을 확인했습니다. 해당 내용에 동의합니다.
  </span>

</label>

</section>

  );
};

export default RefundPolicySection;
