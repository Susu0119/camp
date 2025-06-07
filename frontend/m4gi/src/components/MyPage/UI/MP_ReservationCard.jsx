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
  refundStatus, // 환불 상태 숫자 값
}) => {
  const navigate = useNavigate();


  // 체크리스트 보기 클릭 시 체크리스트 페이지로 이동
  const handleChecklist = () => {
    navigate('/mypage/checklist');
  };

  // 환불 상태 텍스트 반환 함수
  const getRefundStatusText = (status) => {
    switch (status) {
      case 1:
        return '환불 대기중';
      case 2:
        return '환불 완료';
      case 3:
        return '환불 거부';
      case 4:
        return '환불 불가';
      default:
        return '취소됨';
    }
  };

  return (
    <article className="flex items-center justify-start gap-6 px-6 py-4 mb-6 bg-white border border-[#8C06AD] rounded-md w-full max-sm:flex-col max-sm:items-start">
      {/* 캠핑장 이미지 */}
      <div className="flex items-center gap-4">
        <div className="pl-2">
          <img
            src={imageUrl || "/1.png"}
            alt="캠핑장 이미지"
            className="object-cover rounded-md w-[200px] h-[150px] max-sm:w-full max-sm:h-[120px]"
          />
        </div>

        {/* 텍스트 정보 */}
        <div className="flex flex-col justify-start gap-2 px-2">
          <h3 className="text-m font-semibold text-black">캠핑장 이름: {title}</h3>
          <p className="text-s font-light text-black">위치: {location}</p>
          <p className="text-s font-light text-black">이용 예정일: {dates}</p>
            {status !== "cancelled" && (
          <p className="text-s font-light text-black">결제 금액: {amount}</p>
        )}
        </div>
      </div>

      {/* 버튼 또는 상태 표시 */}
      <div className="flex flex-col items-center justify-center gap-2 ml-auto min-w-[110px]">
        {status === "active" && (
          <>
           
            <button
              onClick={onCancel}
              className="w-30 text-center text-sm text-white bg-[#8C06AD] px-3 py-1.5 rounded border border-[#8C06AD]"
            >
              예약 취소
            </button>
            <button
              onClick={handleChecklist}
              className="w-30 text-sm text-white bg-[#8C06AD] px-3 py-1.5 rounded border border-[#8C06AD]"
            >
              체크리스트 보기
            </button>
          </>
        )}

        {status === "completed" && (
          <p className="text-sm text-gray-600">이용 완료</p>
        )}

        {status === "cancelled" && (
          <p className="text-sm text-red-500">{getRefundStatusText(refundStatus)}</p>
        )}
      </div>
    </article>
  );
};

export default ReservationCard;
