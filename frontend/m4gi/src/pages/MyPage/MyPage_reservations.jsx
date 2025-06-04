import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MPSidebar from "../../components/MyPage/UI/MP_SideBar";
import MPHeader from "../../components/MyPage/UI/MP_Header";
import ReservationFilter from "../../components/MyPage/UI/MP_ReservationFilter";
import ReservationCard from "../../components/MyPage/UI/MP_ReservationCard";

export default function MyPageReservations() {
  const [activeFilter, setActiveFilter] = useState("active"); // "active" = 예약중, "cancelled" = 취소됨
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);

      // ✅ 프록시를 타도록 상대경로 사용
      let url = "";
      if (activeFilter === "active") {
        url = "/web/api/UserMypageReservations/ongoing";
      } else if (activeFilter === "cancelled") {
        url = "/web/api/UserMypageReservations/canceled";
      } else {
        setReservations([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/web/api/UserMypageReservations/ongoing", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });


        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "서버 오류 발생");
        }

        const data = await res.json();
        setReservations(data);
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
      <MPHeader />
      <div className="flex flex-1">
        <MPSidebar />
        <div className="flex-1 flex flex-col items-center justify-start p-10 gap-6">
          <ReservationFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <div className="w-full max-w-4xl">
            <div className="p-4 border rounded shadow-sm bg-white">
              {loading ? (
                <p>로딩 중...</p>
              ) : reservations.length === 0 ? (
                <p>예약 내역이 없습니다.</p>
              ) : (
                reservations.map((resv) => (
                  <ReservationCard
                    key={resv.reservationId}
                    title={resv.title}
                    location={resv.location}
                    dates={resv.dates}
                    amount={resv.amount}
                    onCancel={() => {
                      // 예약 취소 페이지로 이동, 예약 ID를 state로 전달
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
