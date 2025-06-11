import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

export default function ReservationList() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    handleTodaySearch();
  }, []);

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

  // 입실/퇴실 상태 '텍스트'만 반환
    const getCheckinStatusText = (status) => {
        switch (status) {
            case 1:
                return <span className="text-blue-600 font-semibold">입실 전</span>;
            case 2:
                return <span className="text-emerald-700 font-semibold">입실 완료</span>;
            case 3:
                return <span className="text-neutral-400">퇴실 완료</span>;
            default:
                return "-";
        }
    };

    // 상태에 따른 '버튼'만 반환
    const getActionButton = (status, reservationId) => {
      switch (status) {
        case 1: // 입실 전 -> '입실 확인' 버튼
          return (
            <button
              className="text-cpurple bg-clpurple px-2 py-1 rounded-md cursor-pointer"
              onClick={() => handleCheckIn(reservationId)}
            >
              입실 확인
            </button>
          );
        case 2: // 입실 완료 -> '퇴실 처리' 버튼
          return (
            <button
              className="text-gray-700 bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
              onClick={() => handleCheckOut(reservationId)}
            >
              퇴실 처리
            </button>
          );
          case 3: // 퇴실 완료 -> 버튼 없음
          default:
            return null; // 버튼을 보여주지 않음
      }
    };

  const fetchReservations = async (fromDate, toDate) => {
    try {
      const res = await axios.get("/web/api/staff/reservations", {
        params: {
          startDate: fromDate,
          endDate: toDate,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error("API 호출 실패", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        await Swal.fire({
          title: `로그인 필요`,
          text: `로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.`,
          icon: 'warning',
          iconColor: '#8C06AD',
          confirmButtonColor: '#8C06AD',
        });
      }
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
    const result = await Swal.fire({
      title: '입실 확인',
      text: "해당 예약을 입실 처리하시겠습니까?",
      icon: 'question',
      iconColor: '#8C06AD',
      showCancelButton: true,
      confirmButtonColor: '#8C06AD',
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/web/api/staff/reservations/${reservationId}/checkin`);
        if (response.status === 204) {
          Swal.fire({
            title: '성공!',
            text: '입실 처리가 완료되었습니다.',
            icon: 'success',
            confirmButtonColor: '#8C06AD',
          });
          setData(prev =>
            prev.map(res =>
              res.reservationId === reservationId
                ? { ...res, checkinStatus: 2 }
                : res
            )
          );
        }
      } catch (err) {
        console.error("입실 처리 중 오류:", err);
        Swal.fire({
          title: '오류 발생',
          text: '입실 처리 중 오류가 발생했습니다.',
          icon: 'error',
          confirmButtonColor: '#8C06AD',
        });
      }
    }
  };

  // 퇴실 처리
  const handleCheckOut = async (reservationId) => {
    const result = await Swal.fire({
      title: '퇴실 처리',
      text: "해당 예약을 퇴실 처리하시겠습니까?",
      icon: 'question',
      iconColor: '#8C06AD',
      showCancelButton: true,
      confirmButtonColor: '#8C06AD',
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/web/api/staff/reservations/${reservationId}/checkout`);
        if (response.status === 204) {
          Swal.fire({
            title: '성공!',
            text: '퇴실 처리가 완료되었습니다.',
            icon: 'success',
            confirmButtonColor: '#8C06AD',
          });
          setData(prev =>
            prev.map(res =>
              res.reservationId === reservationId
                ? { ...res, checkinStatus: 3 }
                : res
            )
          );
        }
      } catch (err) {
        console.error("퇴실 처리 중 오류:", err);
        Swal.fire({
          title: '오류 발생',
          text: '퇴실 처리 중 오류가 발생했습니다.',
          icon: 'error',
          confirmButtonColor: '#8C06AD',
        });
      }
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
                <th className="px-3 py-3">관리</th>
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
        )}
      </div>
    </section>
  );
}
