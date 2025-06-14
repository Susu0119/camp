import React from 'react';

// 입실/퇴실 아이콘
const ICONS = {
  'check-in': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12" />
    </svg>
  ),
  'check-out': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
  ),
};

// 각 목록의 테마 색상
const THEME_STYLES = {
  'check-in': {
    container: 'border-l-4 border-cpurple bg-purple-400/10',
    title: 'text-cpurple',
  },
  'check-out': {
    container: 'border-l-4 border-[#f3b427] bg-[#f3b427]/5',
    title: 'text-[#f3b427]',
  },
  'period': { 
    container: 'border-l-4 border-gray-500 bg-gray-50/50', 
    title: 'text-gray-700' 
  },
};

export default function ReservationTable({ listType, title, reservations, getReservationStatusElement, getCheckinStatusText, getActionButton }) {
  if (!reservations || reservations.length === 0) {
    return null;
  }

  const theme = THEME_STYLES[listType] || { container: '', title: '' };

  return (
    <div className={`p-4 rounded-lg ${theme.container}`}>
        <div className="flex gap-2 mb-5">
            <span className={theme.title}>{ICONS[listType]}</span>
            <h2 className={`text-xl font-bold ${theme.title}`}>{title} ({reservations.length}건)</h2>
        </div>
      <div className="overflow-x-auto border bg-white border-neutral-300 rounded-xl">
        <table className="w-full min-w-[800px]">
          <thead className="text-base bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-gray-600">번호</th>
              <th className="px-3 py-3 text-gray-600">예약자명</th>
              <th className="px-3 py-3 text-gray-600">사이트명</th>
              {/* '입실 목록'에서는 이 컬럼을 숨김 */}
              {listType !== 'check-in' && <th className="px-3 py-3 text-gray-600">입실일</th>}
              {/* '퇴실 목록'에서는 이 컬럼을 숨김 */}
              {listType !== 'check-out' && <th className="px-3 py-3 text-gray-600">퇴실일</th>}
              <th className="px-3 py-3 text-gray-600">예약 상태</th>
              <th className="px-3 py-3 text-gray-600">이용 상태</th>
              <th className="px-3 py-3 text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody className="border-t border-neutral-300">
            {reservations.map((res, i) => (
              <tr key={res.reservationId} className="text-center border-b last:border-b-0 border-gray-200">
                <td className="px-3 py-3 text-gray-500">{i + 1}</td>
                <td className="px-3 py-3 text-gray-800">{res.reserverName}</td>
                <td className="px-3 py-3 text-gray-700">{res.siteName}</td>
                {/* '입실 목록'에서는 이 데이터를 숨김 */}
                {listType !== 'check-in' && <td className="px-3 py-3 text-gray-700">{res.checkInDate}</td>}
                {/* '퇴실 목록'에서는 이 데이터를 숨김 */}
                {listType !== 'check-out' && <td className="px-3 py-3 text-gray-700">{res.checkOutDate}</td>}
                <td className="px-3 py-3">
                  {getReservationStatusElement(res.reservationStatus)}
                </td>
                <td className="px-3 py-3">
                  {res.reservationStatus === 2
                    ? <span>-</span>
                    : getCheckinStatusText(res.checkinStatus)
                  }
                </td>
                <td className="px-3 py-3">
                  {res.reservationStatus === 2
                    ? <span>-</span>
                    : getActionButton(res.checkinStatus, res.reservationId)
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}