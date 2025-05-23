"use client";
import React from 'react';

const GuestInfoForm = () => {
  return (
    <>
      <h2 className="self-stretch px-0 pt-6 pb-2 text-lg font-bold text-fuchsia-700 max-sm:text-base">
        예약자 정보
      </h2>
      <form className="w-full">
        <div className="flex flex-col gap-3 w-full">
          <label className="flex justify-center items-start self-stretch px-3 pt-2.5 pb-2.5 bg-white rounded border border-solid border-stone-300">
            <input
              type="text"
              placeholder="이름 (필수)"
              className="self-stretch px-0 pt-px pb-0.5 text-sm flex-[1_0_0] text-neutral-500 max-sm:text-xs bg-transparent outline-none w-full"
            />
          </label>
          <label className="flex justify-center items-start self-stretch px-3 pt-2.5 pb-2.5 bg-white rounded border border-solid border-stone-300">
            <input
              type="tel"
              placeholder="연락처 (필수)"
              className="self-stretch px-0 pt-px pb-0.5 text-sm flex-[1_0_0] text-neutral-500 max-sm:text-xs bg-transparent outline-none w-full"
            />
          </label>
          <label className="flex justify-center items-start self-stretch px-3 pt-2.5 pb-2.5 bg-white rounded border border-solid border-stone-300">
            <input
              type="email"
              placeholder="이메일 (선택)"
              className="self-stretch px-0 pt-px pb-0.5 text-sm flex-[1_0_0] text-neutral-500 max-sm:text-xs bg-transparent outline-none w-full"
            />
          </label>
          <label className="flex justify-center items-start self-stretch px-3 pt-3 pb-6 bg-white rounded border border-solid border-stone-300">
            <textarea
              placeholder="요청사항 (선택)"
              className="self-stretch px-0 pt-1.5 pb-0.5 text-sm flex-[1_0_0] text-neutral-500 max-sm:text-xs bg-transparent outline-none w-full resize-none"
            />
          </label>
        </div>
      </form>
    </>
  );
};

export default GuestInfoForm;
