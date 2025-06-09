// src/components/MyPage/UI/DeleteAccountForm.jsx
"use client";
import { useState, useEffect } from 'react';
import { useAuth } from "../../../utils/Auth";
import PhoneVerification from './PhoneVerification';
import { useNavigate } from 'react-router-dom';

export default function DeleteAccountForm() {
  const { user: userInfo, isLoading, isAuthenticated } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [reason, setReason] = useState('');
  const [other, setOther] = useState('');
  const [modal, setModal] = useState({ visible: false, message: '' });
  const navigate = useNavigate();

  // 페이지 로드 시 바로 탈퇴 상태 체크해서 모달 띄우기
  useEffect(() => {
    if (!isLoading && isAuthenticated && userInfo.userStatus === 1) {
      setModal({ visible: true, message: '이미 탈퇴된 계정입니다.' });
    }
  }, [isLoading, isAuthenticated, userInfo]);

  // 모달 확인 버튼 핸들러
  const handleModalConfirm = async () => {
    if (modal.message === '이미 탈퇴된 계정입니다.') {
      // 이미 탈퇴된 계정일 때에는 바로 로그인 화면으로
      return navigate('/login');
    }
    if (modal.message === '탈퇴가 완료되었습니다.') {
      // 1) 서버 세션 무효화
      await fetch('/web/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });
      // 2) 클라이언트 스토리지 비우기
      localStorage.removeItem('accessToken');
      sessionStorage.clear();
      // 3) 로그인 페이지로 이동
      navigate('/login');
    }
  };

  // 실제 탈퇴 요청 핸들러
  const handleWithdraw = async () => {
    if (userInfo.userStatus === 1) {
      return setModal({ visible: true, message: '이미 탈퇴된 계정입니다.' });
    }
    const finalReason = reason === '기타 사유 입력' ? other : reason;
    if (!finalReason || finalReason.length < 5) {
      return alert('탈퇴 사유를 5자 이상 입력해주세요.');
    }
    const res = await fetch('/web/api/user/mypage/withdraw', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: finalReason }),
    });
    if (res.ok) {
      setModal({ visible: true, message: '탈퇴가 완료되었습니다.' });
    } else {
      const err = await res.json();
      alert('탈퇴 실패: ' + (err.message || res.status));
    }
  };

  if (isLoading) {
    return <p className="py-10 text-center">로딩 중…</p>;
  }
  if (!isAuthenticated) {
    return <p className="py-10 text-center text-red-500">로그인 후 이용해주세요.</p>;
  }

  return (
    <>
      {/* 모달 */}
      {modal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
            <p className="mb-4">{modal.message}</p>
            <button
              onClick={handleModalConfirm}
              className="px-4 py-2 bg-fuchsia-700 text-white rounded"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 탈퇴 폼 */}
      {!modal.visible && (
        <main className="flex justify-center items-start px-4 py-10 min-h-screen bg-white">
          <div className="w-full max-w-md flex flex-col gap-6">
            <h1 className="text-3xl font-bold">회원 탈퇴</h1>

            {/* 1. 본인인증 */}
            <section className="p-6 border rounded-md">
              <h2 className="text-xl font-semibold mb-2">1. 본인인증</h2>
              <PhoneVerification
                userEmail={userInfo.email}
                onVerified={setIsVerified}
              />
            </section>

            {/* 2. 탈퇴 사유 */}
            <section className="p-6 border rounded-md">
              <h2 className="text-xl font-semibold mb-2">2. 탈퇴 사유</h2>
              <select
                className="w-full mb-4 p-2 border rounded"
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
                  className="w-full h-24 p-2 border rounded mb-4"
                  placeholder="탈퇴 사유를 5자 이상 입력해주세요."
                  value={other}
                  onChange={e => setOther(e.target.value)}
                  disabled={!isVerified}
                />
              )}

              <button
                className={`w-full py-2 font-semibold text-white rounded ${
                  isVerified ? 'bg-fuchsia-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleWithdraw}
                disabled={!isVerified}
              >
                탈퇴 신청
              </button>
            </section>
          </div>
        </main>
      )}
    </>
  );
}
