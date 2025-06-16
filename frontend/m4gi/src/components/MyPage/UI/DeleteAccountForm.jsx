// src/components/MyPage/UI/DeleteAccountForm.jsx
"use client";
import { useState, useEffect } from 'react';
import { useAuth } from "../../../utils/Auth";
import PhoneVerification from './PhoneVerification';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../../utils/Loading';

export default function DeleteAccountForm() {
  const { user: userInfo, isLoading, isAuthenticated } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [reason, setReason]         = useState('');
  const [other, setOther]           = useState('');
  const navigate = useNavigate();

  // 1) 마운트 시 이미 탈퇴된 계정이면 바로 alert → 로그인
  useEffect(() => {
    if (!isLoading && isAuthenticated && userInfo.userStatus === 1) {
      Swal.fire({
        icon: 'warning',
        title: '이미 탈퇴된 계정입니다.',
        confirmButtonText: '확인'
      }).then(() => {
        navigate('/login');
      });
    }
  }, [isLoading, isAuthenticated, userInfo, navigate]);

  // 2) 탈퇴 요청 핸들러
  const handleWithdraw = async () => {
    if (userInfo.userStatus === 1) {
      return Swal.fire({
        icon: 'warning',
        title: '이미 탈퇴된 계정입니다.',
        confirmButtonText: '확인'
      }).then(() => {
        navigate('/login');
      });
    }

    const finalReason = reason === '기타 사유 입력' ? other : reason;
    if (!finalReason || finalReason.length < 5) {
      return Swal.fire({
        icon: 'error',
        title: '탈퇴 사유를 5자 이상 입력해주세요.',
        confirmButtonText: '확인'
      });
    }

    const res = await fetch('/web/api/user/mypage/withdraw', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: finalReason }),
    });

    if (res.ok) {
      // 3) 성공 알림 → 세션 무효화 → 로그인
      Swal.fire({
        icon: 'success',
        title: '탈퇴가 완료되었습니다.',
        confirmButtonText: '확인'
      }).then(async () => {
        await fetch('/web/api/user/logout', { method: 'POST', credentials: 'include' });
        localStorage.removeItem('accessToken');
        sessionStorage.clear();
        //navigate('/login');
        window.location.href = '/login';
      });
    } else {
      const err = await res.json();
      Swal.fire({
        icon: 'error',
        title: '탈퇴 실패',
        text: err.message || `${res.status}`,
        confirmButtonText: '확인'
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  
  if (!isAuthenticated) {
    return <p className="py-10 text-center text-red-500">로그인 후 이용해주세요.</p>;
  }

  return (
    <main className="px-4 py-10 bg-white min-h-screen">
      <div className="w-full max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold">회원 탈퇴</h1>

        {/* 1. 본인인증 */}
        <section className="p-6 border rounded-md border-gray-300 space-y-4">
          <h2 className="text-xl text-gray-600 font-semibold">1. 본인 인증</h2>
          <PhoneVerification
            userEmail={userInfo.email}
            onVerified={setIsVerified}
          />
        </section>

        {/* 2. 탈퇴 사유 */}
        <section className="p-6 border rounded-md border-gray-300 space-y-4">
          <h2 className="text-xl text-gray-600 font-semibold">2. 탈퇴 사유</h2>
          <select
            className="w-full p-2 border rounded"
            value={reason}
            onChange={e => setReason(e.target.value)}
            disabled={!isVerified}
          >
            <option value="">탈퇴 사유를 선택하세요.</option>
            {[
              '예약 시스템이 불편함',
              '할인 혜택 부족',
              '문제 해결 지연',
              '서비스를 자주 이용하지 않음',
              '기타 사유 입력'
            ].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {reason === '기타 사유 입력' && (
            <textarea
              className="w-full h-24 p-2 border rounded"
              placeholder="탈퇴 사유를 5자 이상 입력해주세요."
              value={other}
              onChange={e => setOther(e.target.value)}
              disabled={!isVerified}
            />
          )}
          <button
            className={`w-full py-2 font-semibold text-white rounded ${
              isVerified ? 'bg-[#8C06AD]' : 'bg-gray-300 cursor-not-allowed'
            }`}
            onClick={handleWithdraw}
            disabled={!isVerified}
          >
            탈퇴 신청
          </button>
        </section>
      </div>
    </main>
  );
}
