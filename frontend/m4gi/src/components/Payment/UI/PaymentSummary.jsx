import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Common/Button";

const PaymentSummary = ({ reservation, setReservation }) => {
  const [IMP, setIMP] = useState(null);
  const navigate = useNavigate();

  const totalPrice = reservation.price || reservation.totalPrice || 0;

  // IMP 객체 초기화
  useEffect(() => {
    if (window.IMP) {
      window.IMP.init("imp55607757");
      setIMP(window.IMP);
    } else {
      console.error("🚨 IMP 객체가 아직 로드되지 않았습니다.");
    }
  }, []);

  // 로그인 사용자 정보 불러오기
  useEffect(() => {
    fetch("/web/api/users/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("사용자 정보 응답 오류");
        return res.json();
      })
      .then(user => {
        console.log("🙋 사용자 정보", user);
        setReservation(prev => ({
          ...prev,
          providerUserId: user.providerUserId,
          providerCode: user.providerCode,
          email: user.email,
          nickname: user.nickname,
          phone: user.phone,
        }));
      })
      .catch(error => {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
        alert("사용자 정보를 불러올 수 없습니다.");
      });
  }, [setReservation]);

  const handlePayment = () => {
console.log("🟡 selectedRoom:", reservation.selectedRoom);
console.log("🟡 site_id:", reservation.selectedRoom?.site_id);
console.log("🟡 reservationSite 최종값:",
  typeof reservation.selectedRoom === "object"
    ? reservation.selectedRoom.site_id
    : reservation.siteId || reservation.selectedRoom
);


    if (!IMP) {
      alert("결제 모듈이 아직 로딩되지 않았습니다.");
      return;
    }

    if (!reservation) {
      alert("예약 정보가 없습니다.");
      return;
    }

    const merchantUid = `campia_${Date.now()}`;
    const reservationId = `res_${Date.now()}`;

    // ✅ reservationSite가 객체인지 확인 후 문자열로 추출
    const siteName =
      typeof reservation.selectedRoom === "object"
        ? reservation.selectedRoom.name
        : reservation.selectedRoom || reservation.siteName;

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
              reservationId,
              providerCode: reservation.providerCode,
              providerUserId: reservation.providerUserId,
              reservationSite:
                typeof reservation.selectedRoom === "object"
                  ? reservation.selectedRoom.site_id
                  : reservation.siteId || reservation.selectedRoom,

              
              reservationDate: reservation.checkinDate.replace(/\./g, "-"), // ✅ 추가
              endDate: reservation.checkoutDate.replace(/\./g, "-"),        // ✅ 추가

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
              credentials: "include",
            });

            if (!response.ok) throw new Error("백엔드 응답 오류");

            const result = await response.json();
            console.log("📨 응답 내용:", result);

            alert(result.message || "결제 완료!");

            navigate("/payment/success", {
              state: {
                userName: reservation.nickname,
                campgroundName: reservation.campgroundName,
                siteName: siteName,
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
