import React from 'react';

export default function AdditionalOptions() {
  return (
    <div className="flex gap-4 mt-6 w-full">
      <button className="flex-1 px-4 py-3.5 bg-white rounded text-sm font-semibold hover:bg-gray-50 transition">
        가입한 계정 찾기 <span className="ml-1">›</span>
      </button>
      <button className="flex-1 px-4 py-3.5 bg-white rounded text-sm font-semibold hover:bg-gray-50 transition">
        비회원 예약 확인 <span className="ml-1">›</span>
      </button>
    </div>
  );
}

