import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import ReservationTable from './ReservationTable';

export default function ReservationList() {
  const [mode, setMode] = useState('daily'); // 'daily' 또는 'period'
  const [dailyData, setDailyData] = useState({ checkInList: [], checkOutList: [] });
  const [periodData, setPeriodData] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [isLoading, setIsLoading] = useState(false);

  // 데이터 조회 로직
  // 현재 모드에 따라 API 엔드포인트와 파라미터, 데이터 설정 함수를 동적으로 결정
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const isDailyMode = mode === 'daily';
    const endpoint = isDailyMode ? "/web/api/staff/reservations" : "/web/api/staff/reservations/period";
    const params = isDailyMode ? { startDate, endDate: startDate } : { startDate, endDate };
    const setData = isDailyMode ? setDailyData : setPeriodData;
    const initialData = isDailyMode ? { checkInList: [], checkOutList: [] } : [];

    try {
      const res = await axios.get(endpoint, { params });
      if (isDailyMode) {
        setData(res.data && res.data.checkInList ? res.data : initialData);
      } else {
        setData(Array.isArray(res.data) ? res.data : initialData);
      }
    } catch (err) {
      console.error(`${mode} API 호출 실패`, err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        await Swal.fire({
          title: `로그인 필요`,
          text: `로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.`,
          icon: 'warning',
          iconColor: '#8C06AD',
          confirmButtonColor: '#8C06AD',
        });
      }
      setData(initialData);
    } finally {
      setIsLoading(false);
    }
  }, [mode, startDate, endDate]);

  // 2. 컴포넌트 마운트 또는 모드/날짜 변경 시 데이터 로드
  useEffect(() => {
    // 'period' 모드에서는 자동 조회를 하지 않고 '조회' 버튼으로만 동작
    if (mode === 'daily') {
      fetchData();
    }
  }, [mode, startDate, fetchData]); // 'daily' 모드에서 날짜가 바뀔 때마다 자동 조회
  
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
              className="text-cpurple bg-clpurple px-4 py-2 rounded-md cursor-pointer"
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

    // 입실/퇴실 처리
  const handleUpdateStatus = async (reservationId, action) => {
    const isCheckIn = action === 'checkin';
    const title = isCheckIn ? '입실 확인' : '퇴실 처리';
    const text = `해당 예약을 ${isCheckIn ? '입실' : '퇴실'} 처리하시겠습니까?`;

    const result = await Swal.fire({
      title, text, icon: 'question', iconColor: '#8C06AD',
      showCancelButton: true, confirmButtonColor: '#8C06AD',
      confirmButtonText: '예', cancelButtonText: '아니오'
    });

    if (result.isConfirmed) {
      try {
        await axios.post(`/web/api/staff/reservations/${reservationId}/${action}`);
        
        await Swal.fire({
          title: '성공!',
          text: `${isCheckIn ? '입실' : '퇴실'} 처리가 완료되었습니다.`,
          icon: 'success',
          confirmButtonColor: '#8C06AD',
        });

        fetchData(); 

      } catch (err) {
        console.error(`${title} 중 오류:`, err);
        Swal.fire({
          title: '오류 발생',
          text: `${title} 중 오류가 발생했습니다.`,
          icon: 'error',
          confirmButtonColor: '#8C06AD',
        });
      }
    }
  };

  const handleCheckIn = (reservationId) => handleUpdateStatus(reservationId, 'checkin');
  const handleCheckOut = (reservationId) => handleUpdateStatus(reservationId, 'checkout');
    
  // 모드 변경 핸들러
  const handleModeChange = (newMode) => {
    setMode(newMode);
    // 모드 변경 시 데이터 초기화
    setDailyData({ checkInList: [], checkOutList: [] });
    setPeriodData([]);

    // 'daily' 모드로 돌아올 때 오늘 날짜로 재설정 및 자동 조회
    if (newMode === 'daily') {
      const today = new Date().toISOString().slice(0, 10);
      setStartDate(today);
      setEndDate(today); // endDate도 오늘 날짜로 맞춰줌
    }
  };

  // '기간 내 숙박' 조회 버튼 핸들러
  const handlePeriodSearch = () => {
    fetchData();
  };

  return (
    <section className="w-full pt-10 mx-30">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">예약 관리</h1>

        {/* --- 탭 UI --- */}
        <div className="flex border-b border-gray-200">
          <button onClick={() => handleModeChange('daily')} className={`px-4 py-2 ${mode === 'daily' ? 'border-b-2 border-cpurple text-cpurple' : 'text-gray-500 hover:text-gray-700'}`}>
            일일 현황 (입/퇴실)
          </button>
          <button onClick={() => handleModeChange('period')} className={`px-4 py-2 ${mode === 'period' ? 'border-b-2 border-cpurple text-cpurple' : 'text-gray-500 hover:text-gray-700'}`}>
            기간 내 숙박 현황
          </button>
        </div>

        {/* --- 조회 조건 UI (모드에 따라 변경) --- */}
        {mode === 'daily' ? (
          <div className="flex flex-wrap gap-3 items-center justify-end">
            <input type="date" className="px-4 py-2 border border-neutral-300 rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 items-center justify-end">
            <input type="date" className="px-4 py-2 border border-neutral-300 rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span className="mx-2">~</span>
            <input type="date" className="px-4 py-2 border border-neutral-300 rounded-md" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button type="button" className="px-4 h-10 text-white bg-cpurple rounded-md" onClick={handlePeriodSearch}>조회</button>
          </div>
        )}
        
        {/* --- 결과 표시 UI (모드에 따라 변경) --- */}
        <div className="flex flex-col gap-10 mt-5">
          {isLoading ? 
          <p>
            {/* todo: 로딩중 생략 */}
          </p> 
          : (
            mode === 'daily' ? (
              dailyData.checkInList.length === 0 && dailyData.checkOutList.length === 0 ? (
                <div className="text-center text-gray-500 py-16"><p>선택하신 날짜에 입실 또는 퇴실 예약이 없습니다.</p></div>
              ) : (
                <>
                  <ReservationTable title="입실 목록" reservations={dailyData.checkInList} listType="check-in" {...{ getReservationStatusElement, getCheckinStatusText, getActionButton }} />
                  <ReservationTable title="퇴실 목록" reservations={dailyData.checkOutList} listType="check-out" {...{ getReservationStatusElement, getCheckinStatusText, getActionButton }} />
                </>
              )
            ) : (
              periodData.length === 0 ? (
                <div className="text-center text-gray-500 py-16"><p>선택하신 기간에 숙박 중인 예약이 없습니다.</p></div>
              ) : (
                <ReservationTable title="기간 내 숙박 목록" reservations={periodData} listType="period" {...{ getReservationStatusElement, getCheckinStatusText, getActionButton }} />
              )
            )
          )}
        </div>

      </div>
    </section>
  );
}
