import React, { useEffect, useState } from "react";
import Button from "../../Common/Button";

const PaymentSummary = ({ reservation }) => {
  const [IMP, setIMP] = useState(null);

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
        amount: reservation.totalPrice,
        buyer_email: reservation.email,
        buyer_name: reservation.userName,
        buyer_tel: reservation.userPhone,
        buyer_addr: reservation.address,
        buyer_postcode: "00000",
      },
      async function (rsp) {
        if (rsp.success) {
          await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: rsp.merchant_uid,
              reservationId: reservation.reservationId,
              paymentPrice: rsp.paid_amount,
              paymentMethod: 1,
              paymentStatus: 1,
              pgTransactionId: rsp.imp_uid,
              paidAt: new Date().toISOString(),
            }),
          });

          alert("결제 완료!");
          window.location.href = "/payment/success";
        } else {
          alert("결제 실패: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <footer className="w-full">
      <p className="flex-1 py-0.5 w-full text-lg font-bold text-right text-fuchsia-700">
        총 결제 금액: {reservation?.totalPrice?.toLocaleString() ?? "0"} 원
      </p>
      <Button onClick={handlePayment} disabled={!reservation}>
        결제 하기
      </Button>
    </footer>
  );
};

export default PaymentSummary;
