import React, { useEffect, useState } from "react";
import CSSidebar from "../../components/MyPage/UI/MP_SideBar";
import MPHeader from "../../components/MyPage/UI/MP_Header";
import ReservationFilter from "../../components/MyPage/UI/MP_ReservationFilter";
import ReservationCard from "../../components/MyPage/UI/MP_ReservationCard";

export default function MyPageReservations() {
  const [activeFilter, setActiveFilter] = useState("active"); // active: 예약중, cancelled: 취소됨
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // 필터 변경 시 API 호출
  useEffect(() => {
    setLoading(true);

    let url = "";
    let method = "POST";

    if (activeFilter === "active") {
      url = "/api/UserMypageReservations/ongoing";
    } else if (activeFilter === "cancelled") {
      url = "/api/UserMypageReservations/canceled";
    } else {
      // 완료된 예약 등 추가 필터 필요시 여기에 구현
      setReservations([]);
      setLoading(false);
      return;
    }

    fetch(url, {
      method,
      credentials: "include",  // 세션 인증 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "에러가 발생했습니다.");
        }
        return res.json();
      })
      .then((data) => {
        setReservations(data);
      })
      .catch((err) => {
        alert("예약 정보를 불러오는 데 실패했습니다: " + err.message);
      })
      .finally(() => setLoading(false));
  }, [activeFilter]);

  // 예약 취소 함수
  const cancelReservation = (reservationId) => {
    if (!window.confirm("예약을 정말 취소하시겠습니까?")) return;

    fetch("/api/UserMypageReservations/cancelReservation", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservationId }),  // CancelReservationRequestDTO에 맞게 객체 구성 필요
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "예약 취소 실패");
        }
        return res.text();
      })
      .then((msg) => {
        alert(msg);
        // 취소 성공 시 목록 새로고침
        setActiveFilter("cancelled");
      })
      .catch((err) => alert("예약 취소 중 오류: " + err.message));
  };

  return (
    <div className="h-screen flex flex-col">
      <MPHeader />
      <div className="flex flex-1">
        <CSSidebar />

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
                    onCancel={() => cancelReservation(resv.reservationId)}
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
