import { useRef, useState, useEffect } from "react";
import { adminConfirm, adminSuccess, adminError } from "./Admin_Alert";
import axios from "axios";

function AdminReservationModal({ isOpen, onClose, detail, refreshList }) {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const maskPhone = (phone) => phone?.replace(/(\d{3})-?\d{3,4}-?(\d{4})/, "$1-****-$2");

  // detail을 로컬 상태로 복사해서 씀
  const [localDetail, setLocalDetail] = useState(detail);

  useEffect(() => {
    if (isOpen && detail) {
      setLocalDetail(detail); // 모달 열릴 때 최신값 세팅
    }
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

  useEffect(() => {
  if (localDetail) {
    console.log("환불 상태 코드:", localDetail.refundStatus, typeof localDetail.refundStatus);
  }
}, [localDetail]);

useEffect(() => {
  if (localDetail) {
    console.log("현재 모달에 띄운 예약 ID:", localDetail.reservationId);
    console.log("환불 상태 코드:", localDetail.refundStatus, typeof localDetail.refundStatus);
  }
}, [localDetail]);

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
    const date = new Date(raw);
    return isNaN(date.getTime()) ? "-" : date.toISOString().split("T")[0];
  };

  const mapReservationStatus = (code) => {
  switch (code) {
    case 1: return "예약완료";
    case 2: return "예약취소";
    default: return "-";
    }
  };

  const mapRefundStatus = (code) => {
  switch (code) {
    case 1: return "환불대기";
    case 2: return "환불완료";
    case 3: return "환불거부";
    default: return "-";
  }
};

useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleRefundAction = async (action) => {
    const isApprove = action === "APPROVE";
    const confirmMsg = isApprove
      ? "정말 이 예약을 환불 승인 처리하시겠습니까?"
      : "정말 이 예약을 환불 거절 처리하시겠습니까?";
    const confirmBtn = isApprove ? "네, 승인" : "네, 거절";
  
    // SweetAlert2 확인창
    const result = await adminConfirm(
      "환불 처리",
      confirmMsg,
      confirmBtn,
      "취소"
    );
    if (!result.isConfirmed) return;
  
    try {
      await axios.post(`/web/admin/reservations/${localDetail.reservationId}/refund`, { action });
  
      // 최신 데이터로 갱신
      const res = await axios.get(`/web/admin/reservations/${localDetail.reservationId}`);
      setLocalDetail(res.data);
      if (refreshList) refreshList();
      await adminSuccess("처리가 완료되었습니다.", "완료!");
    } catch (err) {
      console.error("요청이 실패하였습니다.", err);
      await adminError("요청이 실패하였습니다.", "오류");
    }
  };  

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseMove={dragging ? onDrag : null} // 드래그 중일때만 이벤트 등록록
      onMouseUp={stopDrag}
      style={{ pointerEvents: "auto", overflowY: "auto" }}
    >
      <div
        ref={modalRef}
        onMouseDown={startDrag}
        className="bg-white p-10 rounded-2xl w-[700px] max-w-[90%] h-[620px] max-h-[90%] shadow-2xl absolute flex flex-col"
        style={{
          maxHeight: "90vh",
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: "default",
          overflowY: "auto",
        }}
      >
        <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4 select-none">
          <h2 className="text-purple-900/70 text-2xl">예약 상세 정보</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>

        <div className="grid grid-cols-2 mt-6 gap-x-6 gap-y-4 text-lg text-black/80 leading-relaxed">
          <p><strong>예약자 : </strong> {localDetail.userNickname}</p>
          <p className="break-all max-w-[280px]">
          <strong>예약 ID : </strong> {localDetail.reservationId}
          </p>
          <p><strong>전화번호 : </strong> {maskPhone(localDetail.phone)}</p>
          <p><strong>캠핑장 : </strong> {localDetail.campgroundName}</p>
          <p><strong>사이트 : </strong> {localDetail.reservationSite}</p>
          <p><strong>예약일 : </strong> {formatDate(localDetail.reservationDate)}</p>
          <p><strong>입실일 : </strong> {formatDate(localDetail.checkinTime)}</p>
          <p><strong>퇴실일 : </strong> {formatDate(localDetail.checkoutTime)}</p>
          <p><strong>예약상태 : </strong> {mapReservationStatus(localDetail.reservationStatus)}</p>
          <p><strong>환불상태 : </strong> {mapRefundStatus(localDetail.refundStatus)}</p>
          <p><strong>입실상태 : </strong> {localDetail.checkinStatus}</p>
          <p><strong>취소사유 : </strong> {localDetail.cancelReason}</p>
          </div>
          </div>

          {localDetail.refundStatus === 1 && (
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => handleRefundAction("APPROVE")} // 백엔드 action에 맞게 수정
                className="w-[120px] px-3 py-2 bg-purple-900/80 hover:bg-purple-900/90 cursor-pointer shadow-md text-white rounded-lg"
              >
                환불 승인
              </button>
              <button
                onClick={() => handleRefundAction("REJECT")}
                className="w-[120px] px-3 py-2 bg-gray-400/50 hover:bg-gray-400/80 text-black/70 rounded-lg cursor-pointer shadow-md"
              >
                환불 거절
              </button>
            </div>
          )}
        </div>
      </div>
  );
}

export default AdminReservationModal;
