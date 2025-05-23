"use client";
import React, { useState } from 'react';
import FormInput from '../../Common/FormInput';

const GuestInfoForm = ({ onChange }) => {
  const [userName, setName] = useState('');
  const [userPhone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // const [memo, setMemo] = useState('');

  // 값이 바뀔 때마다 부모에 전달
  const handleChange = () => {
    onChange({
      userName: userName,
      userPhone: userPhone,
      email,
      // requestMemo: memo,
    });
  };

  // 각 필드마다 변경 시 상태 + 부모 전달
  const handleInput = (setter) => (e) => {
    setter(e.target.value);
    setTimeout(handleChange, 0); // 상태 반영 후 onChange 호출
  };

  return (
    <>
      <h2 className="self-stretch px-0 pt-6 pb-2 text-lg font-bold text-fuchsia-700 max-sm:text-base">
        예약자 정보
      </h2>
      <form className="w-full">
        <div className="flex flex-col gap-3 w-full">
          <div className="pt-2 w-full space-y-4">
            <FormInput placeholder="이름(필수)" value={userName} onChange={handleInput(setName)} />
          </div>

          <div className="pt-2 w-full space-y-4">
            <FormInput placeholder="전화번호(필수)" value={userPhone} onChange={handleInput(setPhone)} />
          </div>

          <div className="pt-2 w-full space-y-4">
            <FormInput placeholder="이메일(선택)" value={email} onChange={handleInput(setEmail)} />
          </div>

          {/* <label className="flex justify-center items-start self-stretch px-3 pt-3 pb-6 bg-white rounded border border-solid border-stone-300">
            <textarea
              placeholder="요청사항 (선택)"
              className="self-stretch px-0 pt-1.5 pb-0.5 text-sm flex-[1_0_0] text-neutral-500 max-sm:text-xs bg-transparent outline-none w-full resize-none"
              value={memo}
              onChange={handleInput(setMemo)}
            />
          </label> */}
        </div>
      </form>
    </>
  );
};

export default GuestInfoForm;
