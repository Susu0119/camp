import React from 'react';
import ActionButton from './ActionButton';
import FormInput from './FormInput';

const ReservationForm = () => {
  return (
    <div className="w-full px-6 mt-10">
      <section
        className="py-11 bg-white rounded-2xl border-2 border-fuchsia-700 shadow-sm w-full"
        style={{ maxWidth: "928px", margin: "0 auto" }}
      >
        <h1 className="mb-11 text-3xl font-bold text-center text-neutral-900">
          비회원 예약 확인
        </h1>
        <form className="flex flex-col gap-14 px-6">
          {/* 예약자명 */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-bold text-neutral-900">예약자명</label>
            
                <FormInput placeholder="이름" />
            <p className="mt-2 text-sm text-black">
              예약 시 입력한 예약자명을 입력해주세요
            </p>
          </div>

          {/* 휴대폰 번호 */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-bold text-neutral-900">휴대폰 번호</label>
              <FormInput placeholder="전화번호" />
            <p className="mt-2 text-sm text-black">
              예약 시 입력한 휴대폰 번호를 입력해주세요
            </p>
          </div>

          {/* 예약번호 */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-bold text-neutral-900">예약번호</label>
              <FormInput placeholder="예약번호" />
            <p className="mt-2 text-sm text-black">
              이메일과 휴대폰번호로 발송 된 예약 번호를 입력하시오
            </p>
          </div>
        
          <div className="flex flex-col w-full text-center">
              <ActionButton>가입한 계정 찾기</ActionButton>
            </div>
        </form>
      </section>

        <div className="h-[90px]" />

    </div>
  );
};

export default ReservationForm;
