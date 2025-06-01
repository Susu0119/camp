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
  const providerCode = 1;                     // 수정 예정
  const providerUserId = "puid_0016";         // 수정 예정

  // 예약 상태
  const getReservationStatusElement = (status) => {
    switch (status) {
      case 1: 
        return <span className="px-2 py-2 rounded text-neutral-400">예약 완료</span>;
      case 2: 
        return <span className="px-2 py-2 rounded text-red-600">예약 취소</span>;
      default: 
        return "-";
    }
  };

  // 입실 상태
  const getCheckinStatusElement = (status, onCheckIn) => {
    switch (status) {
      case 1:
        return (
          <button
            className="text-cpurple bg-clpurple px-2 py-1 rounded cursor-pointer"
            onClick={onCheckIn}
          >
          입실 확인
          </button>
        );
      case 2:
        return (
          <span className="px-2 py-2 rounded text-neutral-400">입실 완료</span>
        );
      case 3: 
        return (
          <span className="px-2 py-2 rounded text-neutral-400">퇴실 완료</span>
        );
      default:
        return "-";
    }
  };

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
      const today = new Date().toISOString().slice(0, 10);
      setStartDate(today);
      setEndDate(today);
      fetchReservations(today, today);
    }
  };

  // 당일 조회
  const handleTodaySearch = () => {
    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(today);
    fetchReservations(today, today);
  };

  // 입실 완료 버튼 클릭 시 상태 1(입실 전) -> 2(입실 완료)
  const handleCheckIn = async (reservationId) => {
    try {
        const response = await axios.post(`/web/api/staff/reservations/${reservationId}/checkin`);
        if (response.status === 204) {
          setData(prev =>
              prev.map(res =>
              res.reservationId === reservationId
                  ? { ...res, checkinStatus: 2 }
                  : res
              )
          );
        } else {
          alert("입실 처리에 실패했습니다.");           // 모달창으로 변경 (수정 예정)
        }
    } catch (err) {
        console.error("입실 처리 중 오류:", err);
        alert("입실 처리 중 오류가 발생했습니다.");   // 모달창으로 변경 (수정 예정)
      }
    };


  return (
    <section className="w-full pt-10 mx-30">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">예약자 목록</h1>

        <div className="flex flex-wrap gap-3 items-center justify-end">
          <input
            type="date"
            className="px-4 py-2 border border-neutral-300 rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="mx-2">~</span>
          <input
            type="date"
            className="px-4 py-2 border border-neutral-300 rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            type="button"
            className="px-4 pt-2.5 pb-2.5 h-10 leading-5 text-cpurple bg-clpurple rounded-md cursor-pointer w-[110px]"
            onClick={handleSearch}
          >
            기간별 조회
          </button>
          <button
            type="button"
            className="px-4 pt-2.5 pb-2.5 h-10 leading-5 text-white bg-cpurple rounded-md cursor-pointer w-[110px]"
            onClick={handleTodaySearch}
          >
            당일 조회
          </button>
        </div>
        
            {data.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">조회된 예약이 없습니다.</p>
        ) : (
            <div className="flex justify-center align-middle border border-neutral-300 rounded-xl">
                <table className="w-full m-3">
                <thead>
                    <tr>
                    <th className="px-3 py-3">번호</th>
                    <th className="px-3 py-3">예약자명</th>
                    <th className="px-3 py-3">사이트명</th>
                    <th className="px-3 py-3">입실 예정</th>
                    <th className="px-3 py-3">퇴실 예정</th>
                    <th className="px-3 py-3">예약 상태</th>
                    <th className="px-3 py-3">이용 상태</th>
                    </tr>
                </thead>
                <tbody className="border-t border-neutral-500">
                    {data.map((res, i) => (
                      <tr key={res.reservationId} className="text-center">
                        <td className="px-3 py-3">{i + 1}</td>
                        <td className="px-3 py-3">{res.reserverName}</td>
                        <td className="px-3 py-3">{res.siteName}</td>
                        <td className="px-3 py-3">{res.checkInDate}</td>
                        <td className="px-3 py-3">{res.checkOutDate}</td>
                        <td className="px-3 py-3">
                          {getReservationStatusElement(res.reservationStatus)}
                        </td>
                        <td className="px-3 py-3">
                          {res.reservationStatus === 2
                            ? <span>-</span> // 또는 "예약 취소" 등으로 표시
                            : getCheckinStatusElement(res.checkinStatus, () => handleCheckIn(res.reservationId))
                          }
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
