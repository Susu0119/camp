// src/components/MyPage/UI/MP_ReservationCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReservationCard = ({
  imageUrl,
  title,
  location,
  dates,
  amount,
  status,         // 'active', 'completed', 'cancelled' 중 하나
  onCancel,
  refundStatus,
  checkinStatus,  // 정수 or 문자열로 올 수 있음
}) => {
  const navigate = useNavigate();

  const numericCheckinStatus = Number(checkinStatus); // 문자열 대비
  //const cleanImageUrl = (imageUrl ?? "").replace(/^["“”]+|["“”]+$/g, ""); // 따옴표 제거

  // 디버깅 로그
  console.log("🏕️", title, "| checkinStatus:", checkinStatus);
  //console.log("🖼️ 원본 imageUrl:", imageUrl);
  //console.log("🧼 정제된 imageUrl:", cleanImageUrl);
  console.log("------------------------------------------");

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
    if (numericCheckinStatus === 3) {
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
    } else if (status === 'completed') {
      return (
        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
          이용 완료
        </span>
      );
    } else if (status === "cancelled") {
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
      className="
        relative flex items-center justify-between gap-6 px-6 py-4 mb-6 bg-white border border-[#8C06AD] rounded-md w-full max-sm:flex-col max-sm:items-start
        hover:scale-103 transform transition-transform duration-400 ease-in-out
      "
    >
      {/* 이미지 + 텍스트 */}
      <div className="flex items-center gap-4">
        <div className="pl-9">
          {/* ReservationCard.jsx */}
          <img
            //src={cleanImageUrl}
            alt="캠핑장 이미지"
            className="w-full h-48 object-cover rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/no_image.jpg'; // 기본 이미지로 대체 (선택사항)
            }}
          />
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
          {numericCheckinStatus !== 3 && status === "active" && (
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
        </div>
      </div>
    </article>
  );
};

export default ReservationCard;
