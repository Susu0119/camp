// src/pages/mypage/MyPageReservations.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MPSidebar from "../../components/MyPage/UI/MP_SideBar";
import Header from '../../components/Common/Header';
import { apiCore } from "../../utils/Auth";

const ReservationFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'active', label: '이용 예정' },
    { key: 'completed', label: '이용 완료' },
    { key: 'cancelled', label: '취소 내역' },
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200
            ${
              activeFilter === filter.key
                ? 'bg-white text-purple-600 shadow-sm'
                : 'bg-transparent text-gray-600 hover:bg-white/60'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

const StatusBadge = ({ status, refundStatus }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let text = '상태 미확인';

  if (status === 'active') {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-800';
    text = '예약 확정';
  } else if (status === 'completed') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
    text = '이용 완료';
  } else if (status === 'cancelled') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
    text = refundStatus === 'REFUNDED' ? '환불 완료' : '취소 완료';
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      {text}
    </span>
  );
};

const ReservationCard = ({
  imageUrl,
  title,
  location,
  dates,
  amount,
  status,
  refundStatus,
  onCancel,
  onChecklist,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex h-64">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full">
        
        {/* ✨ 수정 2: 이미지 컨테이너가 부모 높이를 100% 채우도록 h-full을 추가합니다. */}
        <div className="w-full sm:w-48 h-full flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* ✨ 수정 3: 정보와 버튼이 위아래 공간을 나눠 갖도록 flex-col, justify-between을 적용합니다. */}
        <div className="flex-grow flex flex-col h-full justify-between">
          {/* 정보 부분 */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500">{location}</p>
              <StatusBadge status={status} refundStatus={refundStatus} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600"><strong>일정:</strong> {dates}</p>
            <p className="text-gray-600"><strong>금액:</strong> {amount}</p>
          </div>

          {/* 버튼 부분 */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
            {status === 'active' && (
              <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-cpurple hover:opacity-90" onClick={onChecklist}>
                체크리스트
              </button>
            )}
            {status === 'active' && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg hover:opacity-90"
              >
                예약 취소
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ------------------------------------------------------------------
// --- 3. 메인 페이지 컴포넌트 ---
// ------------------------------------------------------------------
export default function MyPageReservations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("active");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 쿼리스트링에서 filter 파라미터를 읽어와서 탭을 설정
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter === 'completed' || filter === 'active' || filter === 'cancelled') {
      setActiveFilter(filter);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      let url = "";
      if (activeFilter === "active") url = "/api/UserMypageReservations/ongoing";
      else if (activeFilter === "completed") url = "/api/UserMypageReservations/completed";
      else if (activeFilter === "cancelled") url = "/api/UserMypageReservations/canceled";
      else {
        setReservations([]);
        setLoading(false);
        return;
      }

      try {
        const response = await apiCore.post(url);
        setReservations(response.data);
      } catch (err) {
        alert("예약 정보를 불러오지 못했습니다: " + err.message);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [activeFilter]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header showSearchBar={false} />
      <div className="flex flex-1">
        <MPSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">나의 예약 내역</h1>
              <p className="text-gray-500 mt-1">예약 현황을 확인하고 관리할 수 있습니다.</p>
            </header>

            <ReservationFilter
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <div className="mt-6">
              {loading ? (
                <div className="text-center py-10"><p className="text-gray-500">로딩 중...</p></div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
                  <p className="text-gray-500">예약 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reservations.map((resv) => (
                    <ReservationCard
                      key={`${resv.reservationId}-${resv.reservationDate}`}
                      imageUrl={resv.campgroundThumbnailUrl}
                      title={resv.campgroundName}
                      location={resv.addrFull}
                      dates={
                        resv.reservationDate && resv.endDate
                          ? `${new Date(resv.reservationDate).toLocaleDateString()} ~ ${new Date(resv.endDate).toLocaleDateString()}`
                          : "날짜 정보 없음"
                      }
                      amount={resv.totalPrice != null ? `${resv.totalPrice.toLocaleString()}원` : "금액 정보 없음"}
                      status={activeFilter}
                      refundStatus={resv.refundStatus}
                      onCancel={() => navigate(`/mypage/cancel/${resv.reservationId}`)}
                      onChecklist={() => navigate(`/mypage/reservations/checklist/${resv.reservationId}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}