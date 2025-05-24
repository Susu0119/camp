import React from 'react';
import { useNavigate } from 'react-router-dom';

const CampgroundDetailPage1 = () => {
  const navigate = useNavigate();

  const handleReserve = () => {
    const reservationInfo = {
      campgroundName: "영도도 수락베이스캠프",
      siteName: "카라반 1~4호",
      checkinDate: "2025.05.20",
      checkinTime: "16:00",
      checkoutDate: "2025.05.24",
      checkoutTime: "13:00",
      price: 119000,
      rooms: ["카라반 1호", "카라반 2호", "카라반 3호", "카라반 4호"],
      address: "충청남도 논산시 수락산로 123-4",
      phone: "010-7878-1313",
    };

    navigate('/reservation', { state: reservationInfo });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">캠핑장 상세 정보</h1>
      {/* 캠핑장 소개, 사진, 설명 등 표시 */}
      <button
        onClick={handleReserve}
        className="bg-fuchsia-700 text-white px-4 py-2 rounded"
      >
        예약하기
      </button>
    </div>
  );
};

export default CampgroundDetailPage1;
