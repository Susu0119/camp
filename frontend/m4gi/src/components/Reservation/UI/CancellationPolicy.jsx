import React from 'react';

const CancellationPolicy = () => {
  return (
    <>
      <h2 className="px-0 py-0.5 mt-6 text-lg font-bold text-fuchsia-700 h-[26px] w-[1250px] max-md:w-full">
        취소 및 환불 정책
      </h2>
      <section className="flex flex-col gap-1 items-start px-4 pt-4 pb-5 bg-purple-200 rounded-md h-[120px] w-[1250px] max-md:w-full">
        <div className="text-base text-zinc-800 max-sm:text-sm">
          <p>환불 정책</p>
          <p>14일 전 : 전액 환불</p>
          <p>7 ~ 3일 전 : 50% 환불</p>
          <p>3일 전 : 환불 불가</p>
        </div>
      </section>
    </>
  );
};

export default CancellationPolicy;
