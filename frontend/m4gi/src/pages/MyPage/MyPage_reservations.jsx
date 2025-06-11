// src/pages/mypage/MyPageReservations.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MPSidebar from "../../components/MyPage/UI/MP_SideBar";
import Header from '../../components/Common/Header';
import ReservationFilter from "../../components/MyPage/UI/MP_ReservationFilter";
import ReservationCard from "../../components/MyPage/UI/MP_ReservationCard";
import { apiCore } from "../../utils/Auth";

export default function MyPageReservations() {
  const [activeFilter, setActiveFilter] = useState("active"); // active, completed, cancelled
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);

      // 컨트롤러에 설정된 API 경로에 맞게 URL을 설정합니다.
      let url = "";
      if (activeFilter === "active") {
        url = "/api/UserMypageReservations/ongoing";
      } else if (activeFilter === "completed") {
        url = "/api/UserMypageReservations/completed";
      } else if (activeFilter === "cancelled") {
        url = "/api/UserMypageReservations/canceled";
      } else {
        setReservations([]);
        setLoading(false);
        return;
      }

      try {
        const response = await apiCore.post(url);
        setReservations(response.data);
      } catch (err) {
        alert("예약 정보를 불러오지 못했습니다: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [activeFilter]);

  return (
    <div className="h-screen flex flex-col">
      <Header showSearchBar={false} />
      <div className="flex flex-1">
        <MPSidebar />
        <div className="flex-1 flex flex-col items-center justify-start p-10 gap-6">
          <ReservationFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <div className="w-full max-w-4xl">
            <div>
              {loading ? (
                <p>로딩 중...</p>
              ) : reservations.length === 0 ? (
                <p>예약 내역이 없습니다.</p>
              ) : (
                // ✅ [수정] 렌더링 로직을 하나로 통일합니다.
                // if/else 구문을 제거하고 모든 예약 건에 대해 동일한 props를 전달합니다.
                reservations.map((resv) => (
                  <ReservationCard
                    key={`${resv.reservationId}-${resv.reservationDate}`}
                    // ✨ 모든 탭에서 campgroundThumbnailUrl을 사용하도록 통일
                    imageUrl={resv.campgroundThumbnailUrl || "https://placehold.co/210x150/e0e0e0/777?text=Image\nNot+Found"}
                    title={resv.campgroundName || "캠핑장 이름 없음"}
                    location={resv.addrFull || "위치 정보 없음"}
                    dates={
                      resv.reservationDate && resv.endDate
                        ? `${new Date(resv.reservationDate).toLocaleDateString()} ~ ${new Date(resv.endDate).toLocaleDateString()}`
                        : "날짜 정보 없음"
                    }
                    amount={resv.totalPrice != null ? `${resv.totalPrice.toLocaleString()}원` : "금액 정보 없음"}
                    status={activeFilter} // 현재 탭 상태를 그대로 전달
                    refundStatus={resv.refundStatus} // 백엔드에서 받은 환불 상태 전달
                    checkinStatus={resv.checkinStatus || null}
                    reservationStatus={resv.reservationStatus}
                    reservationId={resv.reservationId} // 체크리스트 페이지 이동을 위한 예약 ID 전달
                    onCancel={() => {
                      navigate(`/mypage/cancel/${resv.reservationId}`);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
