import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, apiCore } from "../../../utils/Auth";
import Button from "../../Common/Button";
import Swal from 'sweetalert2';

const PaymentSummary = ({ reservation, setReservation, onPaymentSuccess }) => {
  const [IMP, setIMP] = useState(null);
  const navigate = useNavigate();
  const { user: userInfo } = useAuth();

  const totalPrice = reservation.totalPrice || reservation.price || 0;

  console.log("PaymentSummary - 가격 정보:", {
    reservationTotalPrice: reservation.totalPrice,
    reservationPrice: reservation.price,
    calculatedTotalPrice: totalPrice
  });

  useEffect(() => {
    if (window.IMP) {
      window.IMP.init("imp55607757");
      setIMP(window.IMP);
    } else {
      console.error("IMP 객체가 아직 로드되지 않았습니다.");
    }
  }, []);

  useEffect(() => {
    if (userInfo) {

      // ✅ 정상 사용자만 예약 정보 세팅
      setReservation((prev) => ({
        ...prev,
        providerUserId: userInfo.providerUserId,
        providerCode: userInfo.providerCode,
        email: userInfo.email,
        nickname: userInfo.nickname,
        phone: userInfo.phone,
      }));
    }
  }, [userInfo, setReservation]);

  const handlePayment = () => {
    if (!IMP) {
      alert("결제 모듈이 아직 로딩되지 않았습니다.");
      return;
    }

    if (!reservation) {
      alert("예약 정보가 없습니다.");
      return;
    }

    const merchantUid = `campia_${Date.now()}`;
    const siteName =
      typeof reservation.selectedRoom === "object"
        ? reservation.selectedRoom.name
        : reservation.selectedRoom || reservation.siteName;

    const { startDate, endDate } = reservation;
    const checkinTime = startDate.replace(/\./g, "-") + `T${reservation.checkinTime}`;
    const checkoutTime = endDate.replace(/\./g, "-") + `T${reservation.checkoutTime}`;

    let reservationSiteValue;
    if (typeof reservation.selectedRoom === "object" && reservation.selectedRoom) {
      reservationSiteValue = reservation.selectedRoom.site_id;
      console.log("selectedRoom.site_id:", reservationSiteValue);
    } else {
      reservationSiteValue = reservation.siteId || reservation.selectedRoom;
      console.log("fallback value:", reservationSiteValue);
    }

    // 🚨 안전장치: reservationSite가 없거나 0이면 에러 표시
    if (!reservationSiteValue || reservationSiteValue === 0 || reservationSiteValue === "0") {
      console.error("🚨 reservationSite 값이 유효하지 않습니다:", reservationSiteValue);
      alert("사이트 정보가 올바르지 않습니다. 다시 예약을 진행해주세요.");
      return;
    }

    IMP.request_pay(
      {
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: merchantUid,
        name: "캠핑장 예약 결제",
        amount: totalPrice,
        buyer_email: reservation.email,
        buyer_name: reservation.nickname,
        buyer_tel: reservation.phone,
        buyer_addr: reservation.address || "",
        buyer_postcode: "00000",
      },
      async function (rsp) {
        if (rsp.success) {
          console.log("✅ 결제 성공, 백엔드 전송 시작");

          try {
            const body = {
              paymentId: rsp.merchant_uid,
              paymentPrice: rsp.paid_amount,
              paymentMethod: 1,
              paymentStatus: 1,
              pgTransactionId: rsp.imp_uid,
              paidAt: new Date().toISOString(),
              reservation: {
                providerCode: reservation.providerCode,
                providerUserId: reservation.providerUserId,
                reservationSite: reservationSiteValue,
                reservationDate: startDate.replace(/\./g, "-"),
                endDate: endDate.replace(/\./g, "-"),
                checkinTime,
                checkoutTime,
                totalPrice: totalPrice,
                qrCode: "",
                totalPeople: reservation.totalPeople,
              },
            };

            const response = await apiCore.post("/api/payments", body);
            console.log("✅ 백엔드 저장 성공:", response.data);

            // ✅ 페이지 이동 대신 모달 호출
            if (onPaymentSuccess) {
              onPaymentSuccess({
                userName: reservation.nickname,
                campgroundName: reservation.campgroundName,
                siteName: siteName,
                startDate,
                endDate,
                checkinTime,
                checkoutTime,
                phone: reservation.phone,
                price: totalPrice,
                priceBreakdown: reservation.priceBreakdown,
                totalPrice: totalPrice,
                reservationId: response.data?.reservationId || "생성중...", // 백엔드에서 받은 실제 UUID 사용
                paymentId: response.data?.paymentId || rsp.merchant_uid,
              });
            }
          } catch (error) {
            console.error("❌ 서버 저장 실패:", error);

            if (error.response?.status === 403) {
              Swal.fire({
                icon: 'warning',
                title: '예약 제한',
                text: '⛔ 예약이 제한된 사용자입니다.',
              }).then(() => navigate("/"));
            } else {
              Swal.fire({
                icon: 'error',
                title: '결제 오류',
                text: '이미 결제된 예약이거나 오류가 발생했습니다.',
              });
            }
          }
          
          
        }
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-cpurple px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          결제 정보
        </h2>
      </div>

      {/* 컨텐츠 */}
      <div className="p-6 space-y-6">
        {/* 총 결제 금액 */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-cpurple">총 결제 금액</p>
                <p className="text-xs text-gray-500">VAT 포함</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-cpurple">{totalPrice.toLocaleString()}원</p>
            </div>
          </div>
        </div>

        {/* 결제 버튼 */}
        <div className="space-y-3">
          <Button
            className="w-full relative overflow-hidden bg-cpurple text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handlePayment}
            disabled={!reservation}
          >
            {/* 배경 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

            {/* 컨텐츠 */}
            <div className="relative flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>

              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">결제하기</span>
                <span className="text-sm">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>

              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* 클릭 시 리플 효과 */}
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 pointer-events-none transition-opacity duration-150 active:opacity-100"></div>
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>안전한 결제를 위해 SSL 보안이 적용됩니다</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
