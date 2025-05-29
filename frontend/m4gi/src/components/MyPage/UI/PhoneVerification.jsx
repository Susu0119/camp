"use client";
import { useState } from 'react';
import Button from '../../Common/Button';
import FormInput from '../../Common/FormInput';

export const PhoneVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  return (
    <section className="flex flex-col gap-2 items-start self-stretch">
      <h3 className="text-sm font-bold leading-5 text-black">이메일</h3>
      <div className="flex flex-col gap-4 items-start w-full">
        <div className="flex gap-4 w-full">
          <input
            type="email"
            placeholder="이메일을 입력해주세요."
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 px-4 pt-2.5 pb-2.5 h-10 text-sm leading-5 bg-white rounded-md border border-solid border-zinc-200 text-zinc-500"
          />
          <Button 
          className="h-10 w-full bg-[#8C06AD] rounded-lg text-white font-bold text-sm"
          >
            인증하기
          </Button>
        </div>
        <input
          type="text"
          placeholder="인증번호를 입력해주세요."
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full px-4 pt-2.5 pb-2.5 h-10 text-sm leading-5 bg-white rounded-md border border-solid border-zinc-200 text-zinc-500"
        />
         <Button
          className="h-10 w-full bg-[#8C06AD] rounded-lg text-white font-bold text-sm"
          >
             확인
        </Button>
      </div>
    </section>
  );
};

export default PhoneVerification;
