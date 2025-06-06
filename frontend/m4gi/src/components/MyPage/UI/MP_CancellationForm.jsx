import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CancellationReasonDropdown from "./MP_CancellationDropdown";

const CancellationForm = ({ reservationId }) => {
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
        "/web/api/UserMypageReservations/cancelReservation",
        { reservationId, cancelReason },
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert(res.data || "예약이 취소되었습니다.");
        navigate("/mypage/reservations");
      }
    } catch (err) {
      console.error("예약 취소 실패:", err);
      alert(
        "예약 취소 실패: " +
          (err.response?.data || err.message || "알 수 없는 오류")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center px-4 py-6">
      <div className="w-full max-w-2xl bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-black mb-4">예약 취소</h2>

        <CancellationReasonDropdown
          showReasons={showReasons}
          toggleReasons={toggleReasons}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
        />

      </div>
    </section>
  );
};

export default CancellationForm;
