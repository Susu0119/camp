import { useRef, useState, useEffect } from "react";
import { adminConfirm, adminSuccess, adminError } from "./Admin_Alert";
import axios from "axios";

// 상세 정보 항목 렌더링 컴포넌트
const DetailItem = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-base font-semibold text-gray-900 break-words">{value || "-"}</dd>
    </div>
);

function AdminUserModal({ isOpen, onClose, detail, refreshList }) {
  const modalRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [localDetail, setLocalDetail] = useState(detail);

  useEffect(() => {
    if (isOpen && detail) {
      setLocalDetail({
        ...detail,
        userStatus: Number(detail.userStatus),
      });
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

  const startDrag = (e) => {
    if (e.target.closest('button')) return;
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  const handleWithdraw = async () => {
    const result = await adminConfirm("비활성화 처리", "정말 비활성화 처리하시겠습니까?", "네, 비활성화합니다");
    if (!result.isConfirmed) return;
    try {
      await axios.patch("/web/admin/users/withdraw", {
        providerCode: localDetail.providerCode,
        providerUserId: localDetail.providerUserId,
      });
      await adminSuccess("완료!", "회원이 비활성화 처리되었습니다.");
      refreshList?.();
      onClose();
    } catch (err) {
      console.error("비활성화 실패:", err);
      await adminError("오류", "비활성화 처리에 실패했습니다.");
    }
  };

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

  if (!isOpen || !localDetail) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60"
      onMouseMove={dragging ? onDrag : null}
      onMouseUp={stopDrag}
    >
      <div
        ref={modalRef}
        onMouseDown={startDrag}
        className="bg-white rounded-xl w-[700px] max-w-[90%] shadow-xl flex flex-col absolute"
        style={{
          maxHeight: "90vh",
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'none'
        }}
      >
        {/* --- 헤더 --- */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-cpurple">사용자 상세 정보</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            style={{cursor: 'pointer'}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* --- 콘텐츠 --- */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-8">
            {/* 왼쪽: 사용자 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">기본 정보</h3>
              <dl className="space-y-4">
                <DetailItem label="닉네임" value={localDetail.nickname} />
                <DetailItem label="이메일" value={localDetail.email} />
                <DetailItem label="전화번호" value={localDetail.phone} />
                <DetailItem label="가입일" value={localDetail.joinDate} />
              </dl>
            </div>
            
            {/* 오른쪽: 권한 관리 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">권한 관리</h3>
              <div className="flex flex-col gap-2 pt-2">
                {[1, 2, 3].map((role) => {
                  const label = { 1: "일반", 2: "관계자", 3: "관리자" }[role];
                  const isCurrent = Number(localDetail.userRole) === role;
                  return (
                    <button
                      key={role}
                      onClick={() => handleChangeRole(role)}
                      disabled={isCurrent}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-semibold transition-all duration-200
                        ${isCurrent
                          ? "bg-purple-600 border-purple-600 text-white cursor-not-allowed"
                          : "bg-white hover:bg-gray-100 hover:border-gray-300 border-gray-200"
                        }`}
                      style={{cursor: isCurrent ? 'not-allowed' : 'pointer'}}
                    >
                      {label}
                      {isCurrent && <span className="text-xs font-normal ml-2">(현재 권한)</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* --- 푸터 (버튼 영역) --- */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          {localDetail.userStatus === 0 && (
            <button
              onClick={handleWithdraw}
              className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 transition-colors"
              style={{cursor: 'pointer'}}
            >
              비활성화 처리
            </button>
          )}
          {localDetail.userStatus === 1 && (
            <button
              onClick={handleActivate}
              className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition-colors"
              style={{cursor: 'pointer'}}
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