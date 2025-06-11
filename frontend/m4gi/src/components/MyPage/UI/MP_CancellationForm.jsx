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
  const [showReasonMissingModal, setShowReasonMissingModal] = useState(false);

  const navigate = useNavigate();

  const toggleReasons = () => setShowReasons((prev) => !prev);
  const toggleAgreement = () => setIsAgreed((prev) => !prev);
  const closeModal = () => setShowAgreementModal(false);
  const closeReasonMissingModal = () => setShowReasonMissingModal(false);

  const handleCancelReservation = async () => {
    console.log("취소 사유:", cancelReason);
    console.log("동의 여부:", isAgreed);

    // 1. 취소 사유가 비어있는지 확인 (모달로 변경)
    if (!cancelReason || cancelReason === "취소 사유를 선택하세요.") {
      setShowReasonMissingModal(true); // 모달 띄우기
      return; // 함수 실행 중단
    }

    // 2. '기타 사유 직접 입력' 또는 '질병 또는 사고'를 선택했는데 상세 사유를 입력하지 않은 경우 (모달로 변경)
    if (
      (cancelReason === "기타 사유 직접 입력" || cancelReason === "질병 또는 사고") &&
      customReason.trim() === ""
    ) {
      setShowReasonMissingModal(true); // 동일한 모달 띄우기 (메시지 변경 가능)
      return; // 함수 실행 중단
    }

    if (!isAgreed) {
      setShowAgreementModal(true);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "/web/api/UserMypageReservations/cancelReservation",
        { reservationId, cancelReason, customReason, refundStatus: 1 },
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
          className="mt-4 w-full bg-[#8C06AD] text-white py-2 rounded-md hover:bg-[#750391] disabled:bg-gray-300"
        >
          {loading ? "처리중..." : "예약 취소하기"}
        </button>
      </div>

      {/* --- 환불 규정 미동의 모달 --- */}
      {showAgreementModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={closeModal} // closeModal은 setShowAgreementModal(false)를 수행
        >
          <div
            className="bg-white rounded-lg p-6 max-w-xs text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-gray-700">환불 규정에 동의하셔야 예약을 취소할 수 있습니다.</p>
            <button
              onClick={closeModal}
              className="mt-2 px-4 py-2 bg-[#8C06AD] text-white rounded-md hover:bg-purple-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* --- 취소 사유 미선택 모달 --- */}
      {showReasonMissingModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={closeReasonMissingModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-xs text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-gray-700">취소 사유를 선택해주세요.</p>
            <button
              onClick={closeReasonMissingModal}
              className="mt-2 px-4 py-2 bg-[#8C06AD] text-white rounded-md hover:bg-purple-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CancellationForm;