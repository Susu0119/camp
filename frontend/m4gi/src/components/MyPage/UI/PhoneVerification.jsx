"use client";
import { useState } from 'react';
import axios from 'axios';
import Button from '../../Common/Button';

export const PhoneVerification = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verified, setVerified] = useState(false);

  const handleSendCode = async () => {
    try {
      const response = await axios.post('/web/api/auth/send-code', null, {
        params: { email: email }
      });
      alert("인증번호가 이메일로 전송되었습니다.");
    } catch (error) {
      alert("인증번호 전송 실패: " + error.response?.data || error.message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('/web/api/auth/verify-code', null, {
        params: {
          email: email,
          code: verificationCode
        },
        withCredentials: true  // 세션 유지 필요 시
      });
      alert("인증 성공!");
      setVerified(true);
    } catch (error) {
      alert("인증 실패: " + error.response?.data || error.message);
    }
  };

  return (
    <section className="flex flex-col gap-2 items-start self-stretch">
      <h3 className="text-sm font-bold leading-5 text-black">이메일</h3>
      <div className="flex flex-col gap-4 items-start w-full">
        <div className="flex w-full gap-4 max-[393px]:flex-col">
  <div className="flex-grow min-w-[200px]">
    <input
      type="email"
      placeholder="이메일을 입력해주세요."
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-4 h-12 text-base bg-white border border-zinc-200 rounded-md text-zinc-700"
    />
  </div>
  <div className="flex-shrink-0 min-w-[200px] max-[393px]:w-full">
    <Button
      className="w-full h-12 px-6 text-base bg-[#8C06AD] text-white font-bold rounded-md whitespace-nowrap"
      onClick={handleSendCode}
    >
      인증하기
    </Button>
  </div>
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
        onClick={handleVerifyCode}>확인</Button>
      </div>
      {verified && <p className="text-green-600 text-sm mt-2">✅ 인증 완료되었습니다.</p>}
    </section>
  );
};

export default PhoneVerification;