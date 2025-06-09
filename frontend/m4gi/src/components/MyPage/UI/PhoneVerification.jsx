"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../Common/Button';

export const PhoneVerification = ({ userEmail, onVerified }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    onVerified(verified);
  }, [verified, onVerified]);

  const handleSendCode = async () => {
    if (!email) return;

    // 정규화: 앞뒤 공백 제거 + 소문자 변환
    const inputEmail  = email.trim().toLowerCase();
    const dbEmail     = userEmail.trim().toLowerCase();
    console.log('Email 비교 → 입력:', inputEmail, ', DB:', dbEmail);

    if (inputEmail !== dbEmail) {
      alert('이메일이 틀렸습니다.');
      return;
    }

    try {
      await axios.post('/web/api/auth/send-code', null, {
        params: { email: inputEmail },
        withCredentials: true
      });
      alert("인증번호가 이메일로 전송되었습니다.");
    } catch (err) {
      alert("전송 실패: " + (err.response?.data || err.message));
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) return;

    try {
      await axios.post('/web/api/auth/verify-code', null, {
        params: {
          email: email.trim().toLowerCase(),
          code: verificationCode.trim()
        },
        withCredentials: true,
      });
      setVerified(true);
      alert("인증 성공!");
    } catch (err) {
      alert("인증 실패: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        type="email"
        placeholder="이메일을 입력해주세요."
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={verified}
        className={`w-full px-4 h-12 border rounded-md ${
          verified ? 'bg-zinc-100 text-zinc-500' : 'bg-white text-zinc-700'
        }`}
      />
      <Button
        onClick={handleSendCode}
        disabled={verified || !email.trim()}
        className="w-full h-12 font-bold text-white bg-[#8C06AD] rounded-md"
      >
        인증번호 전송
      </Button>

      <input
        type="text"
        placeholder="인증번호를 입력해주세요."
        value={verificationCode}
        onChange={e => setVerificationCode(e.target.value)}
        disabled={verified}
        className="w-full px-4 h-10 border rounded-md bg-white text-zinc-700"
      />
      <Button
        onClick={handleVerifyCode}
        disabled={verified || !verificationCode.trim()}
        className="w-full h-10 font-bold text-white bg-[#8C06AD] rounded-md"
      >
        인증 확인
      </Button>

      {verified && (
        <p className="text-sm text-green-600">✅ 본인 인증 완료</p>
      )}
    </div>
  );
};

export default PhoneVerification;
