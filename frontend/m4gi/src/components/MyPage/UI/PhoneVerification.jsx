// src/components/MyPage/UI/PhoneVerification.jsx
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../Common/Button';
import Swal from 'sweetalert2';

export const PhoneVerification = ({ userEmail, onVerified }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verified, setVerified] = useState(false);

  // 부모에게 인증 여부 전달
  useEffect(() => {
    onVerified(verified);
  }, [verified, onVerified]);

  const handleSendCode = async () => {
    if (!email.trim()) return;

    const inputEmail = email.trim().toLowerCase();
    const dbEmail = userEmail.trim().toLowerCase();
    if (inputEmail !== dbEmail) {
      return Swal.fire({
        icon: 'error',
        title: '존재하지 않는 이메일입니다.',
        confirmButtonText: '확인'
      });
    }

    try {
      await axios.post(
        '/web/api/auth/send-code',
        null,
        { params: { email: inputEmail }, withCredentials: true }
      );
      Swal.fire({
        icon: 'info',
        title: '인증번호가 이메일로 전송되었습니다.',
        confirmButtonText: '확인'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '전송 실패',
        text: '인증번호가 전송이 실패하였습니다.',
        confirmButtonText: '확인'
      });
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) return;

    try {
      await axios.post(
        '/web/api/auth/verify-code',
        null,
        {
          params: {
            email: email.trim().toLowerCase(),
            code: verificationCode.trim()
          },
          withCredentials: true,
        }
      );
      setVerified(true);
      Swal.fire({
        icon: 'success',
        title: '인증이 완료되었습니다.',
        confirmButtonText: '확인'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '인증 실패',
        text: '인증번호가 올바르지 않습니다.',
        confirmButtonText: '확인'
      });
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* 이메일 + 전송 */}
      <div className="space-y-2">
        <input
          type="email"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={verified}
          className={`w-full px-4 h-12 border rounded-md ${verified ? 'bg-zinc-100 text-zinc-500' : 'bg-white text-zinc-700'
            }`}
        />
        <Button
          onClick={handleSendCode}
          disabled={verified || !email.trim()}
          className="w-full h-12 font-bold text-white bg-[#8C06AD] rounded-md"
        >
          인증번호 전송
        </Button>
      </div>

      {/* 인증번호 + 확인 */}
      <div className="space-y-2">
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
      </div>

      {/* 인증 완료 표시 */}
      {verified && (
        <p className="mt-2 text-sm text-green-600">✅ 본인 인증 완료</p>
      )}
    </div>
  );
};

export default PhoneVerification;
