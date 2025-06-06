// CancellationForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CancellationReasonDropdown from "./MP_CancellationDropdown";
import RefundPolicySection from "./MP_RefundPolicySection";
import GuidelinesSection from "./MP_GuildelineSection";

const CancellationForm = ({ reservationId }) => {
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAgreed, setIsAgreed] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const navigate = useNavigate();

  const toggleReasons = () => setShowReasons((prev) => !prev);
  const toggleAgreement = () => setIsAgreed((prev) => !prev);
  const closeModal = () => setShowAgreementModal(false);

  const handleCancelReservation = async () => {
    console.log("취소 사유:", cancelReason);
    console.log("동의 여부:", isAgreed);

    if (
      (cancelReason === "기타 사유 직접 입력" || cancelReason === "질병 또는 사고") &&
      customReason.trim() === ""
    ) {
      alert("상세한 취소 사유를 입력해주세요.");
      return;
    }

    if (!isAgreed) {
      setShowAgreementModal(true);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "/web/api/UserMypageReservations/cancelReservation",
        { reservationId, cancelReason, customReason, refundStatus: 1  },
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
          customReason={customReason}
          setCustomReason={setCustomReason}
        />

        {/* 안내사항 컴포넌트 추가 */}
        <GuidelinesSection />

        <RefundPolicySection
          isAgreed={isAgreed}
          toggleAgreement={toggleAgreement}
          showModal={showAgreementModal}
          closeModal={closeModal}
        />

        <button
          onClick={handleCancelReservation}
          disabled={loading}
          className="mt-4 w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 disabled:bg-gray-300"
        >
          {loading ? "처리중..." : "예약 취소하기"}
        </button>
      </div>
    </section>
  );
};

export default CancellationForm;
