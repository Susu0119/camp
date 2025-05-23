"use client";
import { useState } from 'react';
import FormInput from '../../UI/FormInput';
import ActionButton from '../../UI/ActionButton';

export default function SignupForm() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="w-full px-6">
      <div className="mx-auto" style={{ maxWidth: "420px" }}>
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full px-6 py-8 rounded-2xl shadow-lg border border-white 
                    bg-[rgba(255,255,255,0.3)] backdrop-blur-md"
        >
          <h2 className="text-2xl font-bold leading-none text-center text-white">
            회원가입 / 소셜 중복 확인
          </h2>
          <p className="pt-4 text-sm leading-5 text-center text-white">
            전화번호를 입력하여 중복 회원가입을 <br />
            확인해 주세요
          </p>
          <div className="pt-2 w-full space-y-4">
            <FormInput placeholder="전화번호" />

            <div className="flex overflow-hidden flex-col justify-center w-full font-bold text-center">
              <ActionButton>회원가입 / 소셜 중복 확인</ActionButton>
            </div>
          </div>
        </form>
      </div>
    </div>


  );
};