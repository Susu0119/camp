import { useState, useEffect } from "react";
import axios from "axios";
import CSSidebar from "../../components/MyPage/UI/MP_SideBar";
import Header from "../../components/Common/Header";
import CancellationForm from "../../components/MyPage/UI/MP_CancellationForm";
//import GuidelinesSection from "../../components/MyPage/UI/MP_GuildelineSection";
//import RefundPolicySection from "../../components/MyPage/UI/MP_RefundPolicySection";
import ReservationDetails from "../../components/MyPage/UI/MP_ReservationDetails";
import { useParams, useNavigate } from "react-router-dom";

export default function MyPageCancel() {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 취소 폼 상태들
  const [cancelReason, setCancelReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // 환불 규정 동의 상태 추가
  const [isAgreed, setIsAgreed] = useState(false);

  // 성공 모달 상태 추가
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 환불 규정 동의 모달 상태 (RefundPolicySection 내부 모달용)
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  useEffect(() => {
    if (!reservationId) return;

    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `/web/api/UserMypageReservations/ongoing`,
          null,
          {
            withCredentials: true,
          }
        );

        const reservations = response.data;

        const foundReservation = reservations.find(
          (res) => String(res.reservationId) === String(reservationId)
        );

        if (!foundReservation) {
          setError("해당 예약 정보를 찾을 수 없습니다.");
          setReservation(null);
        } else {
          setReservation({
            imageUrl:
              foundReservation.imageUrl ||
              "https://cdn.builder.io/api/v1/image/assets/TEMP/dd9828108ede19b4b6853e150638806bd7022c50?placeholderIfAbsent=true",
            title: foundReservation.campgroundName || "예약 정보 없음",
            location: foundReservation.addrFull || "",
            dates: `${new Date(
              foundReservation.reservationDate
            ).toLocaleDateString()} - ${new Date(
              foundReservation.endDate
            ).toLocaleDateString()}`,
            amount: foundReservation.amount || "",
          });
        }
      } catch (err) {
        setError("예약 정보를 불러오는 데 실패했습니다.");
        setReservation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [reservationId]);

  const toggleReasons = () => setShowReasons((prev) => !prev);

  // 환불 규정 동의 체크박스 토글 함수
  const toggleAgreement = () => {
    setIsAgreed((prev) => !prev);
  };

  const handleCancelReservation = async () => {
    if (!cancelReason) {
      alert("취소 사유를 선택해주세요.");
      return; // 취소 사유가 없으면 여기서 함수 실행 중단
    }

    if (!isAgreed) {
      // 동의 안 했으면 모달 띄우고 취소 중단
      setShowAgreementModal(true);
      return;
    }

    setCancelLoading(true);

    try {
      const res = await axios.post(
        "/web/api/UserMypageReservations/cancelReservation",
        {
          reservationId,
          cancelReason,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        // alert 대신 모달 표시
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("예약 취소 실패:", err);
      alert(
        "예약 취소 실패: " +
          (err.response?.data || err.message || "알 수 없는 오류")
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // 모달 닫힌 뒤 예약 내역 페이지로 이동
    navigate("/mypage/reservations");
  };

  const closeAgreementModal = () => {
    setShowAgreementModal(false);
  };

  if (!reservationId) {
    return <div>잘못된 요청입니다. 예약 ID가 없습니다.</div>;
  }

  if (loading) {
    return <div>예약 정보를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showSearchBar={false} />
      <div className="flex-1 flex overflow-y-auto">
        <CSSidebar />
        <div className="flex-1 p-4 space-y-1 flex flex-col items-center">
          {/* 예약 정보 */}
          <div className="w-full max-w-[612px]">
            <ReservationDetails {...reservation} />
          </div>

          {/* 취소 폼 */}
          <div className="w-full max-w-[612px]">
            <CancellationForm
              reservationId={reservationId}
              cancelReason={cancelReason}
              setCancelReason={setCancelReason}
              showReasons={showReasons}
              toggleReasons={toggleReasons}
              // --- 이 부분이 수정되었습니다: isAgaged -> isAgreed ---
              isAgreed={isAgreed} // isAgreed prop 전달
              toggleAgreement={toggleAgreement} // toggleAgreement prop 전달
              onCancelReservation={handleCancelReservation} // 취소 버튼 클릭 핸들러 전달
              cancelLoading={cancelLoading} // 로딩 상태 전달
            />
          </div>
        </div>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={closeSuccessModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-xs text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-gray-700">예약이 성공적으로 취소되었습니다.</p>
            <button
              onClick={closeSuccessModal}
              className="mt-2 px-4 py-2 bg-[#8C06AD] text-white rounded-md hover:bg-purple-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 환불 규정 미동의 모달 (기존 코드 유지) */}
      {showAgreementModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={closeAgreementModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-xs text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-gray-700">환불 규정에 동의하셔야 예약을 취소할 수 있습니다.</p>
            <button
              onClick={closeAgreementModal}
              className="mt-2 px-4 py-2 bg-[#8C06AD] text-white rounded-md hover:bg-purple-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}