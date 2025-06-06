import { useState, useEffect } from "react";
import axios from "axios";
import CSSidebar from "../../components/MyPage/UI/MP_SideBar";
import Header from "../../components/Common/Header";
import CancellationForm from "../../components/MyPage/UI/MP_CancellationForm";
import GuidelinesSection from "../../components/MyPage/UI/MP_GuildelineSection";
import RefundPolicySection from "../../components/MyPage/UI/MP_RefundPolicySection";
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

  useEffect(() => {
    if (!reservationId) return;

    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(`/web/api/UserMypageReservations/ongoing`, null, {
          withCredentials: true,
        });

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
            dates: `${new Date(foundReservation.reservationDate).toLocaleDateString()} - ${new Date(foundReservation.endDate).toLocaleDateString()}`,
            amount: foundReservation.amount || "",
          });
        }
      } catch (err) {
        setError("예약 정보를 불러오는데 실패했습니다.");
        setReservation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [reservationId]);

  const toggleReasons = () => setShowReasons((prev) => !prev);

  const handleCancelReservation = async () => {
    if (!cancelReason) {
      alert("취소 사유를 선택해주세요.");
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
      setCancelLoading(false);
    }
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
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-auto">
        <CSSidebar />
        <div className="flex-1 p-6 space-y-6 flex flex-col items-center">
          <div className="w-[612px] max-md:w-full mx-auto">
            <ReservationDetails {...reservation} />
          </div>

          <div className="w-[612px] max-md:w-full mx-auto">
            <CancellationForm
              reservationId={reservationId}
              cancelReason={cancelReason}
              setCancelReason={setCancelReason}
              showReasons={showReasons}
              toggleReasons={toggleReasons}
            />
          </div>

          <div className="w-[612px] max-md:w-full mx-auto">
            <GuidelinesSection />
          </div>

          <div className="w-[612px] max-md:w-full mx-auto">
            <RefundPolicySection />
          </div>

         
          <div className="w-[612px] max-md:w-full mx-auto mt-4">
            <button
              onClick={handleCancelReservation}
              disabled={cancelLoading}
              style={{ backgroundColor: "#8C06AD" }}
              className="w-full text-white px-6 py-2 rounded transition"
            >
              {cancelLoading ? "취소 중..." : "취소 신청"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
