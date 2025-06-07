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
}) => {
  const navigate = useNavigate();

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
    if (status === 'active') {
      return (
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
          예약중
        </span>
      );
    } else if (status === 'completed') {
      return (
        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
          이용 완료
        </span>
      );
    } else if (status === 'cancelled') {
      return (
        <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
          {getRefundStatusText(refundStatus)}
        </span>
      );
    } else {
      return null;
    }
  };

  return (
    <article className="relative flex items-center justify-start gap-6 px-6 py-4 mb-6 bg-white border border-[#8C06AD] rounded-md w-full max-sm:flex-col max-sm:items-start">
      
      {/* 캠핑장 이미지 및 텍스트 */}
      <div className="flex items-center gap-4">
        <div className="pl-9">
          <img
            src={imageUrl || "/1.png"}
            alt="캠핑장 이미지"
            className="object-cover rounded-md w-[210px] h-[150px] max-sm:w-full max-sm:h-[120px]"
          />
        </div>

        <div className="flex flex-col justify-start gap-2 px-2">
          <h3 className="text-xl font-bold text-black">{title}</h3>
          <p className="text-sm font-light text-gray-700">위치: {location}</p>
          <p className="text-sm font-light text-gray-700">이용 예정일: {dates}</p>
          {status !== "cancelled" && (
            <p className="text-sm font-light text-gray-700">결제 금액: {amount}</p>
          )}
        </div>
      </div>

      {/* 상태 배지와 버튼 그룹 */}
      <div className="flex items-center gap-6 pl-6">
        {/* 배지 */}
        <div>
          {renderStatusBadge()}
        </div>

        {/* 버튼 세로 스택 */}
        <div className="flex flex-col gap-2">
          {status === "active" && (
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
                체크리스트 보기
              </button>
            </>
          )}

          {status === "completed" && (
            <p className="text-sm text-gray-600">이용해주셔서 감사합니다.</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default ReservationCard;
