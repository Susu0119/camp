import React from 'react';

const dummyData = [
  { id: 36, campName: '달빛캠핑장', status: '입실 전', user: '김부각', state: '환불완료' },
  { id: 37, campName: '노을캠핑장', status: '퇴실완료', user: '이만두', state: '환불취소' },
  { id: 38, campName: '아늑캠핑장', status: '입실 전', user: '곽과이', state: '환불대기중' },
  { id: 39, campName: '그린캠핑장', status: '입실완료', user: '박부리', state: '예약완료' },
];

const getStateColor = (state) => {
  switch (state) {
    case '환불완료': return 'text-blue-600';
    case '환불취소': return 'text-gray-500';
    case '환불대기중': return 'text-red-500';
    case '예약완료': return 'text-green-600';
    default: return '';
  }
};

export default function AdminReservationList() {
  return (
    <div className="p-6 bg-white rounded-xl shadow w-full">
      <h2 className="text-2xl font-bold mb-4">예약 관리</h2>

      {/* 필터 */}
      <div className="flex gap-4 mb-6">
        <input type="date" className="border px-2 py-1 rounded" defaultValue="2025-05-05" />
        <input type="text" placeholder="검색" className="border px-2 py-1 rounded w-48" />
        <select className="border px-2 py-1 rounded text-sm">
          <option>지역명</option>
        </select>
        <select className="border px-2 py-1 rounded text-sm">
          <option>수단</option>
        </select>
        <select className="border px-2 py-1 rounded text-sm">
          <option>상태</option>
        </select>
        <select className="border px-2 py-1 rounded text-sm">
          <option>최근등록순</option>
        </select>
      </div>

      {/* 테이블 */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">번호</th>
            <th className="p-2 border">캠핑장명</th>
            <th className="p-2 border">입실/퇴실</th>
            <th className="p-2 border">예약자명</th>
            <th className="p-2 border">예약현황</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="p-2 border">{item.id}</td>
              <td className="p-2 border">{item.campName}</td>
              <td className="p-2 border">{item.status}</td>
              <td className="p-2 border">{item.user}</td>
              <td className={`p-2 border font-semibold ${getStateColor(item.state)}`}>
                {item.state}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center gap-2 text-sm">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((page) => (
          <button key={page} className="px-2 py-1 border rounded hover:bg-purple-100">
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
