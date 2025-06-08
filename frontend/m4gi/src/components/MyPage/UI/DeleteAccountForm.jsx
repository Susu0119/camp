"use client";
import { useState } from 'react';
import PhoneVerification from './PhoneVerification';

export const DeleteAccountForm = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    '예약 시스템이 불편함',
    '할인 혜택 부족',
    '문제 해결 지연',
    '서비스를 자주 이용하지 않음',
    '기타 사유 입력'
  ];

  const handleWithdraw = async () => {
    const reasonToSend = selectedReason === '기타 사유 입력' ? otherReason : selectedReason;
    if (!reasonToSend || reasonToSend.length < 5) {
      alert('탈퇴 사유를 5자 이상 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/web/api/user/mypage/withdraw', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason: reasonToSend }),
      });

      if (response.ok) {
        alert('탈퇴가 완료되었습니다.');
        window.location.href = '/main';
      } else {
        const data = await response.json();
        alert('탈퇴 실패: ' + (data.message || '서버 오류'));
      }
    } catch (err) {
      console.error(err);
      alert('탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="flex justify-center items-start px-4 py-10 min-h-[966px] w-full bg-white">
      <div className="w-full max-w-[672px]">
        <h1 className="text-3xl font-bold text-black mb-6">회원 탈퇴</h1>

        <div className="flex flex-col gap-6 p-6 bg-white border border-zinc-200 rounded-md">
          {/* Stepper */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isVerified ? 'text-fuchsia-700' : 'text-zinc-400'}`}>
              1. 본인인증
            </span>
            <span className="flex-1 h-px bg-zinc-200 mx-2" />
            <span className={`text-sm font-medium ${isVerified ? 'text-fuchsia-700' : 'text-zinc-400'}`}>
              2. 탈퇴 사유
            </span>
          </div>

          {/* 본인인증 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-black">본인인증</h2>
            <p className="text-sm text-zinc-500">회원 탈퇴를 위해 본인 인증이 필요합니다.</p>
            <PhoneVerification onVerified={(ok) => setIsVerified(ok)} />
          </div>

          {/* 탈퇴 사유 & 버튼 */}
          <div className="flex flex-col gap-3 mt-4">
            <h2 className="text-xl font-semibold text-black">탈퇴 사유</h2>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              disabled={!isVerified}
              className={`w-full px-4 py-2 text-sm border rounded-md ${
                isVerified ? 'border-zinc-200 text-zinc-600' : 'border-zinc-100 bg-zinc-50 text-zinc-300'
              }`}
            >
              <option value="">탈퇴 사유를 선택하세요.</option>
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {selectedReason === '기타 사유 입력' && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                disabled={!isVerified}
                placeholder="탈퇴 사유를 15자 이상 작성해주세요."
                className="w-full h-24 px-4 py-2 text-sm border border-zinc-200 rounded-md resize-none"
              />
            )}

            <button
              onClick={handleWithdraw}
              disabled={!isVerified || !selectedReason || (selectedReason === '기타 사유 입력' && otherReason.length < 5)}
              className={`w-full h-12 text-sm font-bold text-white rounded-md
                ${isVerified ? 'bg-fuchsia-700' : 'bg-zinc-300 cursor-not-allowed'}`}
            >
              탈퇴 신청
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DeleteAccountForm;
