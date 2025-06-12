import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { getKSTDateTime } from "../../../utils/KST";

function AdminPaymentModal({ isOpen, onClose, detail }) {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [localDetail, setLocalDetail] = useState(detail);

  useEffect(() => {
    if (isOpen && detail) setLocalDetail(detail);
  }, [isOpen, detail]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const modal = modalRef.current;
      const { innerWidth, innerHeight } = window;
      const { offsetWidth, offsetHeight } = modal;
      setPosition({
        x: (innerWidth - offsetWidth) / 2,
        y: (innerHeight - offsetHeight) / 2,
      });
    }
  }, [isOpen]);

  const startDrag = (e) => {
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onDrag = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const stopDrag = () => setDragging(false);

  if (!isOpen || !localDetail) return null;

  const formatDate = (raw) => {
    if (!raw) return "-";

    // raw가 배열이면 처리
    if (Array.isArray(raw)) {
      const [year, month, day, hour = 0, minute = 0] = raw;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    const date = new Date(raw);
    return isNaN(date.getTime()) ? "-" : getKSTDateTime(date).split("T")[0];
  };

  // null, undefined, 빈 문자열 체크 함수
    const isNullOrEmpty = (v) => v === null || v === undefined || v === "";

  const getPaymentStatusText = (s) => {
    switch (Number(s)) {
      case 2: return "결제완료";
      case 3: return "결제취소";
      default: return "-";
    }
  };

  const getPaymentMethodText = (method) => {
    switch (Number(method)) {
      case 1: return "카카오페이";
      case 2: return "무통장입금";
      default: return "-";
    }
  };

  const getApprovalStatusTextByRefund = (status) => {
    switch (Number(status)) {
      case 1: return "승인대기";
      case 2: return "승인됨";
      case 3: return "승인거부";
      case 4: return "승인불가";
      default: return "-";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseMove={dragging ? onDrag : null}
      onMouseUp={stopDrag}
      style={{ pointerEvents: "auto" }}
    >
      <div
        ref={modalRef}
        onMouseDown={startDrag}
        className="bg-white p-10 rounded-2xl w-[550px] max-w-[90vh] h-[720px] max-h-[90vh] shadow-2xl absolute flex flex-col"
        style={{ left: `${position.x}px`, top: `${position.y}px`, cursor: "default" }}
      >
        <div className="flex justify-between items-center mb-4 select-none">
          <h2 className="text-purple-900/70 text-2xl">결제 상세 정보</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>

        <div className="flex flex-col space-y-3 text-black/80 text-lg mt-6 leading-relaxed">
          <p><strong>예약자 : </strong> {localDetail.userNickname}</p>
          <p><strong>전화번호 : </strong> {localDetail.userPhone}</p>
          <p><strong>캠핑장 : </strong> {localDetail.campgroundName}</p>
          <p><strong>사이트 ID : </strong> {localDetail.reservationSite}</p>
          <p><strong>입실일 : </strong> {formatDate(localDetail.checkinTime)}</p>
          <p><strong>퇴실일 : </strong> {formatDate(localDetail.checkoutTime)}</p>
          <p><strong>결제금액 : </strong> <span className="text-blue-500">{localDetail.paymentPrice?.toLocaleString()}원</span></p>
          <p><strong>결제수단 : </strong> {getPaymentMethodText(localDetail.paymentMethod)}</p>
          <p><strong>결제상태 : </strong> {getPaymentStatusText(localDetail.paymentStatus)}</p>
          <p><strong>결제일자 : </strong> {formatDate(localDetail.paidAt)}</p>
          {console.log("💬 환불 상태 코드:", localDetail.refundStatus)}
          <p><strong>승인상태 : </strong> {getApprovalStatusTextByRefund(localDetail.refundStatus)}</p>
          {localDetail.refundAmount != null && (
            <p><strong>환불금액 : </strong> <span className="font-bold text-purple-500">{localDetail.refundAmount?.toLocaleString()}원</span></p>
          )}
          {localDetail.feeAmount != null && (
            <p><strong>수수료 : </strong> {localDetail.feeAmount?.toLocaleString()}원</p>
          )}
          {localDetail.refundType != null && (
          <p>
          <strong>환불유형 : </strong>
          {
           // 환불상태 없거나(=null/undefined/0), 승인대기(1), 환불유형 자체가 null/빈값이면 "-"
           (!localDetail.refundStatus
           || Number(localDetail.refundStatus) === 1
           || isNullOrEmpty(localDetail.refundType)
            )
           ? "-"
           : (Number(localDetail.refundType) === 1 ? "수동" : "자동")
          }
          </p>
          
          )}
          <p>
          <strong>환불일자 : </strong>
          {localDetail.refundedAt ? formatDate(localDetail.refundedAt) : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminPaymentModal;