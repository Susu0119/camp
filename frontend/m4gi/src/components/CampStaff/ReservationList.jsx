import React, { useState } from "react";
import axios from "axios";

// 필터 버튼
const FilterButton = ({ label, onClick }) => (
  <button
    type="button"
    className="px-4 pt-2.5 pb-2.5 h-10 leading-5 text-cpurple bg-clpurple rounded-md cursor-pointer w-[109px] max-sm:px-3 max-sm:py-2 max-sm:text-xs max-sm:w-[90px]"
    onClick={onClick}
  >
    {label}
  </button>
);

export default function ReservationList() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 추후 수정 예정
  const providerCode = 1;
  const providerUserId = "puid_0004";

  const fetchReservations = async (fromDate, toDate) => {
    try {
      const res = await axios.get("/web/api/staff/reservations", {
        params: {
          providerCode,
          providerUserId,
          startDate: fromDate,
          endDate: toDate,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error("API 호출 실패", err);
      setData([]);
    }
  };

  // 기간별 조회 
  const handleSearch = () => {
    if (startDate && endDate) {
      fetchReservations(startDate, endDate);
    } else {
      alert("시작일과 종료일을 모두 입력하세요.");
    }
  };

  // 당일 조회
  const handleTodaySearch = () => {
    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(today);
    fetchReservations(today, today);
  };

  // 체크인 3 -> 4
  const handleCheckIn = async (reservationId) => {
    try {
        const response = await axios.post(`/web/api/staff/reservations/${reservationId}/checkin`);
        if (response.status === 204) {
        // 상태 갱신 (입실완료로)
        setData(prev =>
            prev.map(res =>
            res.reservationId === reservationId
                ? { ...res, reservationStatus: 4 }
                : res
            )
        );
        } else {
        alert("입실 처리에 실패했습니다.");
        }
    } catch (err) {
        console.error("입실 처리 중 오류:", err);
        alert("입실 처리 중 오류가 발생했습니다.");
    }
    };


  return (
    <section className="flex justify-center pt-10 mx-auto">
      <div className="w-full flex flex-col px-30 gap-5">
        <h1 className="text-3xl">예약자 목록</h1>

        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="date"
            className="px-4 py-2 border border-neutral-300 rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="mx-2 text-zinc-500">~</span>
          <input
            type="date"
            className="px-4 py-2 border border-neutral-300 rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <FilterButton label="기간별 조회" onClick={handleSearch} />
          <FilterButton label="당일 조회" onClick={handleTodaySearch} />
        </div>

            {data.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">조회된 예약이 없습니다.</p>
        ) : (
            <div className="flex justify-center align-middle border-2 border-neutral-300 rounded-xl">
                <table className="w-full m-3">
                <thead>
                    <tr>
                    <th className="px-3 py-2">번호</th>
                    <th className="px-3 py-2">예약자명</th>
                    <th className="px-3 py-2">사이트명</th>
                    <th className="px-3 py-2">입실 예정</th>
                    <th className="px-3 py-2">퇴실 예정</th>
                    <th className="px-3 py-2">비고</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((res, i) => (
                    <tr key={res.reservationId} className="text-center">
                        <td className="px-3 py-2">{i + 1}</td>
                        <td className="px-3 py-2">{res.reserverName}</td>
                        <td className="px-3 py-2">{res.siteName}</td>
                        <td className="px-3 py-2">{res.checkInDate}</td>
                        <td className="px-3 py-2">{res.checkOutDate}</td>
                        <td className="px-3 py-2">
                            {res.reservationStatus === 3 ? (
                                <button
                                className="text-cpurple bg-clpurple px-2 py-1 rounded cursor-pointer"
                                onClick={() => handleCheckIn(res.reservationId)}
                                >
                                입실 확인
                                </button>
                            ) : res.reservationStatus === 4 ? (
                                <span className="px-2 py-2 rounded text-neutral-400">입실 완료</span>
                            ) : res.reservationStatus === 2 ? (
                                <span className="px-2 py-2 rounded text-red-600">예약 취소</span>
                            ) : res.reservationStatus === 5 ? (
                                <span className="px-2 py-2 rounded text-neutral-400">퇴실 완료</span>
                            ) : res.reservationStatus === 1 ? (
                                <span className="px-2 py-2 rounded text-neutral-400">예약 완료</span>
                            ) : (
                                "-"
                            )}
                        </td>

                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        )}
      </div>
    </section>
  );
}
