import { useRef, useState, useEffect } from "react";
import { adminConfirm, adminSuccess, adminError } from "./Admin_Alert";
import axios from "axios";

function AdminUserModal({ isOpen, onClose, detail, refreshList }) {
  const modalRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [localDetail, setLocalDetail] = useState(detail);

  // ✅ detail 값이 변경될 때 로컬 상태로 설정 + userStatus 숫자 변환
  useEffect(() => {
    if (isOpen && detail) {
      setLocalDetail({
        ...detail,
        userStatus: Number(detail.userStatus),
      });
    }
  }, [isOpen, detail]);

  // ✅ 모달 초기 위치 중앙으로 이동
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

  // ✅ 드래그 관련 이벤트
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

  // ✅ ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ✅ 권한 변경 핸들러
  const handleChangeRole = async (newRole) => {
    if (Number(localDetail.userRole) === Number(newRole)) {
      await adminError("변경 불가", "이미 선택된 권한입니다.");
      return;
    }

    const result = await adminConfirm("권한 변경", "정말 권한을 변경하시겠습니까?");
    if (!result.isConfirmed) return;

    try {
      await axios.patch("/web/admin/users/role", {
        providerCode: localDetail.providerCode,
        providerUserId: localDetail.providerUserId,
        role: newRole,
      });

      await adminSuccess("완료!", "권한이 변경되었습니다.");
      refreshList?.();
      onClose();
    } catch (err) {
      console.error("권한 변경 실패:", err);
      await adminError("오류", "권한 변경에 실패했습니다.");
    }
  };

  // ✅ 사용자 비활성화 (탈퇴) 처리
  const handleWithdraw = async () => {
    const result = await adminConfirm("탈퇴 처리", "정말 탈퇴(비활성화) 처리하시겠습니까?");
    if (!result.isConfirmed) return;

    try {
      await axios.patch("/web/admin/users/withdraw", {
        providerCode: localDetail.providerCode,
        providerUserId: localDetail.providerUserId,
      });

      await adminSuccess("완료!", "회원이 탈퇴 처리되었습니다.");
      refreshList?.();
      onClose();
    } catch (err) {
      console.error("탈퇴 실패:", err);
      await adminError("오류", "탈퇴 처리에 실패했습니다.");
    }
  };

  // ✅ 사용자 활성화 처리
  const handleActivate = async () => {
    const result = await adminConfirm("활성화 처리", "정말로 활성화 처리하시겠습니까?");
    if (!result.isConfirmed) return;

    try {
      await axios.patch("/web/admin/users/status", {
        providerCode: localDetail.providerCode,
        providerUserId: localDetail.providerUserId,
        status: 0,
      });

      await adminSuccess("완료!", "사용자가 다시 활성화되었습니다.");
      refreshList?.();
      onClose();
    } catch (err) {
      console.error("활성화 실패:", err);
      await adminError("오류", "활성화 처리에 실패했습니다.");
    }
  };

  // ✅ 날짜 포맷
  const formatDate = (raw) => {
    if (!raw) return "-";
    const date = new Date(raw);
    return isNaN(date.getTime()) ? "-" : date.toISOString().split("T")[0];
  };

  // ✅ 모달 렌더링 조건
  if (!isOpen || !localDetail) return null;

// ✅ 실제 모달 컴포넌트 렌더링
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
      className="bg-white p-10 rounded-2xl w-[700px] max-w-[90vh] h-[450px] max-h-[90vh] shadow-2xl absolute flex flex-col"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: "default",
      }}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4 select-none">
        <h2 className="text-purple-900/70 text-2xl">사용자 상세 정보</h2>
        <button onClick={onClose} className="text-xl font-bold">&times;</button>
      </div>

      {/* 좌/우 정보 grid */}
      <div className="flex-1 flex flex-col">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-6 text-black/80 leading-relaxed">
        {/* 왼쪽: 상세 정보 */}
        <div className="flex flex-col gap-x-6 gap-y-4 text-lg">
          <p><strong>닉네임 : </strong> {localDetail.nickname}</p>
          <p><strong>이메일 : </strong> {localDetail.email}</p>
          <p><strong>전화번호 : </strong> {localDetail.phone}</p>
          <p><strong>가입일 : </strong> {formatDate(localDetail.joinDate)}</p>
        </div>
        {/* 오른쪽: 권한 변경만 */}
        <div className="flex flex-col gap-x-6 gap-y-4 text-lg">
          <label className="block">권한 변경 : </label>
          <div className="flex flex-col gap-3 w-full max-w-[120px]">
            {[1, 2, 3].map((role) => {
              const label = {
                1: "일반 사용자",
                2: "캠핑장 관계자",
                3: "관리자",
              }[role];
              const isCurrent = Number(localDetail.userRole) === role;
              return (
                <button
                  key={role}
                  onClick={() => {
                    if (isCurrent) {
                      adminError("변경 불가", "이미 선택된 권한입니다.");
                      return;
                    }
                    handleChangeRole(role);
                  }}
                  disabled={isCurrent}
                  className={`px-4 py-2 rounded-2xl border font-semibold text-sm transition-all shadow-sm duration-200 cursor-pointer
                    ${isCurrent
                      ? "bg-gray-200 border-gray-200 cursor-not-allowed"
                      : "bg-white hover:bg-purple-100 border-gray-200"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* 하단 버튼 → grid 바깥! */}
      <div className="flex justify-end gap-4 mt-4">
        {localDetail.userStatus === 0 && (
          <button
            onClick={handleWithdraw}
            className="w-[150px] cursor-pointer text-white py-2 rounded-lg shadow-md bg-red-500 hover:bg-red-600 transition"
          >
            비활성화 처리
          </button>
        )}
        {localDetail.userStatus === 1 && (
          <button
            onClick={handleActivate}
            className="w-[150px] cursor-pointer bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            활성화 처리
          </button>
        )}
      </div>
    </div>
  </div>
);

}

export default AdminUserModal;
