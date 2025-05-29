"use client";
import { useState } from 'react';
import PhoneVerification from './PhoneVerification';

export const DeleteAccountForm = () => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    '예약 시스템이 불편함',
    '할인 혜택 부족',
    '문제 해결 지연',
    '서비스를 자주 이용하지 않음',
    '기타 사유 입력'
  ];

  return (
    <main className="flex flex-col items-center px-10 pt-10 pb-24 h-[966px] w-[1149px] max-md:p-5 max-md:w-full max-sm:p-4">
      <div className="flex flex-col gap-6 items-start max-w-2xl w-[672px] max-md:w-full max-md:max-w-full">
        <h1 className="text-3xl font-bold leading-9 text-black max-sm:text-2xl max-sm:leading-8">
          회원 탈퇴
        </h1>

        <div className="flex flex-col gap-6 items-start self-stretch rounded-md">
          <section className="flex flex-col gap-2 items-start px-2.5 pt-0 pb-3.5 rounded-md border border-solid border-zinc-200 w-full">
            <div className="flex flex-col gap-2.5 items-start p-2.5 w-full">
              <div className="flex flex-col gap-2.5 items-start self-stretch p-2.5">
                <h2 className="text-2xl font-bold leading-5 text-black max-sm:text-xl">
                  본인인증
                </h2>
                <p className="text-sm leading-5 text-zinc-500">
                  회원 탈퇴를 위해 본인 인증이 필요합니다.
                </p>
              </div>
            </div>
            <PhoneVerification />
          </section>

          <section className="flex flex-col gap-3 items-start self-stretch p-6 bg-white rounded-md border border-solid border-zinc-200">
            <h2 className="text-2xl font-bold leading-5 text-black max-sm:text-xl">
              탈퇴 사유
            </h2>

            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-4 py-2.5 text-sm leading-5 bg-white rounded-md border border-solid border-zinc-200 text-zinc-500"
            >
              <option value="">탈퇴 사유를 선택하세요.</option>
              {reasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            {selectedReason === '기타 사유 입력' && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="탈퇴 사유를 15자 이상 작성해주세요."
                className="w-full h-[65px] px-4 py-2.5 text-sm bg-white rounded-md border border-solid border-zinc-200 resize-none"
              />
            )}
          </section>

          <button className="w-full px-4 pt-2.5 pb-2.5 h-10 text-sm font-bold leading-5 text-center bg-fuchsia-700 rounded-md text-neutral-50">
            탈퇴 신청
          </button>
        </div>
      </div>
    </main>
  );
};

export default DeleteAccountForm;