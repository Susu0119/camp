import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Common/Button";

const PaymentSummary = ({ reservation }) => {
  const [IMP, setIMP] = useState(null);
  const navigate = useNavigate();

  const totalPrice = reservation.price || reservation.totalPrice || 0;

  useEffect(() => {
    if (window.IMP) {
      window.IMP.init("imp55607757");
      setIMP(window.IMP);
    } else {
      console.error("🚨 IMP 객체가 아직 로드되지 않았습니다.");
    }
  }, []);

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

    IMP.request_pay(
      {
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: merchantUid,
        name: "캠핑장 예약 결제",
        amount: totalPrice,
        buyer_email: reservation.email,
        buyer_name: reservation.userName,
        buyer_tel: reservation.phone,
        buyer_addr: reservation.address,
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
                reservationId: "res_" + Date.now(),
                providerCode: reservation.providerCode,
                providerUserId: reservation.providerUserId,
                reservationSite: reservation.selectedRoom || reservation.siteName,
                checkinTime: reservation.checkinDate.replace(/\./g, "-") + "T16:00:00",
                checkoutTime: reservation.checkoutDate.replace(/\./g, "-") + "T11:00:00",
                totalPrice: reservation.price,
              },
            };

            console.log("📦 전송 데이터:", body);

            const response = await fetch("/web/api/payments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });

            console.log("📡 응답 상태:", response.status);
            const result = await response.text();
            console.log("📨 응답 내용:", result);

            alert("결제 완료!");

            // ✅ 쿼리스트링 대신 state 전달로 변경
            navigate("/payment/success", {
              state: {
                userName: reservation.userName,
                campgroundName: reservation.campgroundName,
                siteName: reservation.siteName,
                checkinDate: reservation.checkinDate,
                checkoutDate: reservation.checkoutDate,
                phone: reservation.phone,
                price: reservation.price,
              },
            });
          } catch (error) {
            console.error("❌ 서버 저장 실패:", error);
            alert("서버 저장 실패: " + error.message);
          }
        } else {
          alert("결제 실패: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <footer className="w-full">
      <p className="flex-1 py-0.5 w-full text-lg font-bold text-right text-fuchsia-700">
        총 결제 금액: {totalPrice.toLocaleString()} 원
      </p>
      <Button onClick={handlePayment} disabled={!reservation}>
        결제 하기
      </Button>
    </footer>
  );
};

export default PaymentSummary;
