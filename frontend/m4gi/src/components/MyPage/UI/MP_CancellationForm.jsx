import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CancellationReasonDropdown from "./MP_CancellationDropdown";

const CancellationForm = ({ reservationId }) => {
  // 백엔드에서 요구하는 키값과 맞추기 위해 selectedReason를 cancelReason로 이름 변경
  const [cancelReason, setCancelReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleReasons = () => setShowReasons(!showReasons);

  const handleCancelReservation = async () => {
  if (!cancelReason) {
    alert("취소 사유를 선택해주세요.");
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post(
      `/web/admin/reservations/${reservationId}/cancel`, 
      { cancelReason }  // 요청 바디에 cancelReason만 포함
    );

    if (res.status === 200) {
      alert(res.data.message || "예약이 취소되었습니다.");
      navigate("/mypage/reservations");
    }
  } catch (err) {
    console.error("예약 취소 실패:", err);
    alert("예약 취소 실패: " + (err.response?.data?.message || err.message));
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full p-6 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">예약 취소</h2>

      <CancellationReasonDropdown
        showReasons={showReasons}
        toggleReasons={toggleReasons}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
      />

      <button
        onClick={handleCancelReservation}
        disabled={loading}
        style={{ backgroundColor: "#8C06AD" }}
        className="mt-4 w-full text-white px-6 py-2 rounded transition"
      >
        {loading ? "취소 중..." : "취소 신청"}
      </button>
    </div>
  );
};

export default CancellationForm;
