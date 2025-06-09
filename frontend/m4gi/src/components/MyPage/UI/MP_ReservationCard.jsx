import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReservationCard = ({
  imageUrl,
  title,
  location,
  dates,
  amount,
  status,
  onCancel,
  refundStatus,
  checkinStatus,
  reservationStatus,
}) => {
  const navigate = useNavigate();

  // 날짜 파싱 함수
  const parseStartDate = (dates) => {
    if (!dates) return null;
    const parts = dates.split('~');
    if (parts.length === 0) return null;
    const startDateStr = parts[0].trim().replace(/\./g, '-').replace(/-+/g, '-');
    const normalizedDateStr = startDateStr.replace(/\s/g, '').replace(/-$/, '');
    return new Date(normalizedDateStr);
  };

  const reservationDate = parseStartDate(dates);
  if (!reservationDate || isNaN(reservationDate.getTime())) {
    // console.error('날짜 파싱 오류:', dates); // 필요한 경우 로깅
  }

  const numericCheckinStatus = Number(checkinStatus);
  const numericReservationStatus = Number(reservationStatus);

  if (isNaN(numericReservationStatus)) {
    // console.error('예약 상태 숫자 변환 오류:', reservationStatus); // 필요한 경우 로깅
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCompleted =
    numericCheckinStatus === 3 ||
    (reservationDate && reservationDate < today && numericReservationStatus === 1);

  const handleChecklist = () => {
    navigate('/mypage/checklist');
  };

  const getRefundStatusText = (status) => {
    switch (status) {
      case 1: return '환불 대기중';
      case 2: return '환불 완료';
      case 3: return '환불 거부';
      case 4: return '환불 불가';
      default: return '예약 취소됨';
    }
  };

  const renderStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
          이용 완료
        </span>
      );
    }

    if (status === 'active') {
      return (
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
          예약중
        </span>
      );
    } else if (status === 'cancelled') {
      return (
        <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
          {getRefundStatusText(refundStatus)}
        </span>
      );
    } else {
      return (
        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
          {status}
        </span>
      );
    }
  };

  return (
    <article
      className="relative flex items-center justify-between gap-6 px-6 py-4 mb-6 bg-white border border-[#8C06AD] rounded-md w-full max-sm:flex-col max-sm:items-start hover:scale-103 transform transition-transform duration-400 ease-in-out"
    >
      {/* 이미지 + 텍스트 */}
      <div className="flex items-center gap-4">
        {/* ✅ [수정] 이미지 부분을 감싸는 div 추가 및 스타일 변경 */}
        {/* 1. 이미지 컨테이너의 너비를 지정하고, 줄어들지 않도록 설정 */}
        <div className="flex-shrink-0 w-[210px] max-sm:w-full">
          {/* 2. 이미지의 가로세로 비율을 7:5로 고정 */}
          <div className="w-full aspect-[7/5]"> 
            <img
              src={imageUrl}
              alt="캠핑장 이미지"
              // 3. 이미지가 부모 div를 꽉 채우도록 설정
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
        
        <div className="flex flex-col justify-start gap-2 px-2">
          <h3 className="text-xl font-bold text-black">{title}</h3>
          <p className="text-sm font-light text-gray-700">이용 예정일: {dates}</p>

          {status === 'cancelled' ? (
            <p className="text-sm font-semibold text-red-600">
              환불 상태: {getRefundStatusText(refundStatus)}
            </p>
          ) : (
            <>
              <p className="text-sm font-light text-gray-700">위치: {location}</p>
              <p className="text-sm font-light text-gray-700">결제 금액: {amount}</p>
            </>
          )}
        </div>
      </div>

      {/* 상태 및 버튼 */}
      <div className="flex items-center gap-6 pl-3">
        <div>{renderStatusBadge()}</div>

        <div className="flex flex-col gap-2">
          {!isCompleted && status === 'active' && (
            <>
              <button
                onClick={onCancel}
                className="w-36 text-center text-base font-semibold text-white bg-[#8C06AD] px-4 py-2 rounded-md border border-[#8C06AD] hover:bg-[#76059b]"
              >
                예약 취소
              </button>
              <button
                onClick={handleChecklist}
                className="w-36 text-base font-semibold text-white bg-[#8C06AD] px-4 py-2 rounded-md border border-[#8C06AD] hover:bg-[#76059b]"
              >
                체크리스트
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default ReservationCard;
