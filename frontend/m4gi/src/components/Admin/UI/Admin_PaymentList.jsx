import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminPaymentModal from "./Admin_PaymentModal";
import Pagination from './Admin_Pagination';

export default function AdminPaymentList() {
  const itemsPerPage = 14;
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const fetchPayments = async (params = {}) => {
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "")
      );

      console.log("💬 검색 요청 params", filteredParams);
      const res = await axios.get("/web/admin/payments", { params: filteredParams });
      setFiltered(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ 결제 목록 불러오기 실패:", err);
      alert("데이터 불러오기 실패");
    }
  };

  const handleRowClick = async (paymentId) => { // <-- 인자 이름을 paymentId로 변경
    try {
      const res = await axios.get(`/web/admin/payments/${paymentId}`); // 이제 이 paymentId는 클릭된 행의 정확한 paymentId를 가리킵니다.
      setSelectedDetail(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("상세 정보 불러오기 실패:", err); // 디버깅을 위해 콘솔에 에러를 찍는 것이 좋습니다.
      alert("상세정보 불러오기 실패");
    }
  };
  useEffect(() => {
    fetchPayments({});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPayments({
      reservationStatus: paymentStatus,
      paymentStatus: paymentStatus,
      approvalStatus: approvalStatus,
      sortOrder,
      keyword,
      startDate,
      endDate
    });
  };

  const formatDate = (raw) => {
    if (!raw) return "-";
    if (Array.isArray(raw)) {
      const [yyyy, mm, dd] = raw;
      return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
    }
    const date = new Date(raw);
    return isNaN(date.getTime()) ? "-" : date.toISOString().split("T")[0];
  };

  const getPaymentStatusLabel = (s) => {
    switch (Number(s)) {
      case 2: return <span className="text-blue-500">결제완료</span>;
      case 3: return <span className="text-gray-500">결제취소</span>;
      default: return <span className="text-gray-400">-</span>;
    }
  };

  const getApprovalStatusLabel = (status) => {
    if (status === null || status === undefined) {
      return <span className="text-gray-400">-</span>; // 환불요청 없음
    }

    switch (Number(status)) {
      case 1: return <span className="text-red-500">승인대기</span>;  // 환불대기 → 승인대기
      case 2: return <span className="text-green-500">승인됨</span>;   // 환불완료 → 승인됨
      case 3: return <span className="text-gray-500">승인거절됨</span>; // 환불거부 → 승인거절됨
      case 4: return <span className="text-purple-600">환불불가</span>;
      default: return <span className="text-gray-400">-</span>;
    }
  };

  const resetFilters = () => {
    setPaymentStatus("");
    setApprovalStatus("");
    setKeyword("");
    setSortOrder("DESC");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    fetchPayments({});
  };

  const paginatedPayments = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  return (
    <div className="min-h-screen bg-gray-10 flex select-none">
      <Sidebar />
      <main className="flex-1 px-8 py-6 max-w-screen-2xl mx-auto">
        <h1 className="text-4xl text-purple-900/70 mt-4 mb-6">결제 관리</h1>
        <form onSubmit={handleSearch} className="mb-6 p-4 text-black/70 border border-gray-200 shadow-sm rounded-xl flex flex-col gap-4">
          <div className="flex flex-wrap justify-end gap-4">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none" />
            <span className="self-center text-sm text-gray-400">~</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none" />
            <select
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none"
              value={sortOrder}
              onChange={(e) => {
                const value = e.target.value;
                setSortOrder(value);
                fetchPayments({
                  reservationStatus: paymentStatus,
                  paymentStatus: paymentStatus,
                  approvalStatus: approvalStatus,
                  sortOrder: value,
                  keyword,
                  startDate,
                  endDate
                });
              }}
            >
              <option value="DESC">최신 결제순</option>
              <option value="ASC">오래된 결제순</option>
              <option value="priceDesc">금액 높은순</option>
              <option value="priceAsc">금액 낮은순</option>
            </select>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="">전체 결제상태</option>
              <option value="2">결제완료</option>
              <option value="3">결제취소</option>
            </select>
            <select
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="">전체 승인상태</option>
              <option value="1">승인대기</option>
              <option value="2">승인됨</option>
              <option value="3">승인거절됨</option>
              <option value="4">환불불가</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <input type="text" name="keyword" placeholder="사용자명 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="bg-purple-300/30 px-4 py-1 rounded-xl w-60 focus:outline-none shadow-sm" />
            <button type="submit" className="bg-purple-900/80 hover:bg-purple-900/90 text-white px-6 py-2 rounded-lg shadow-sm cursor-pointer">검색</button>
            <button type="button" onClick={resetFilters} className="bg-gray-400/50 hover:bg-gray-400/80 text-black/70 px-4 py-2 rounded-lg shadow-sm cursor-pointer">초기화</button>
          </div>
        </form>

        <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
          <table className="w-full border-collapse text-lg text-black/80">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">예약자</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">캠핑장</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">결제금액</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">결제상태</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">결제일</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">승인상태</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-gray-400 py-4">결제 내역이 없습니다.</td></tr>
              ) : (
                paginatedPayments.map((pay) => (
                  <tr key={pay.paymentId} onClick={() => handleRowClick(pay.paymentId)} className="hover:bg-purple-100 text-center cursor-pointer">
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap align-middle">{pay.userNickname}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap align-middle">{pay.campgroundName}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap align-middle">{pay.paymentPrice.toLocaleString()}원</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap align-middle">{getPaymentStatusLabel(pay.paymentStatus)}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap align-middle text-sm">{formatDate(pay.paidAt)}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap align-middle">{getApprovalStatusLabel(pay.refundStatus)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage} // setCurrentPage 그대로 넘기면 됨!
        pageRange={2} // 옵션, 기본값 2
        />

        {modalOpen && selectedDetail && (
          <AdminPaymentModal
            isOpen={modalOpen}
            detail={selectedDetail}
            onClose={() => setModalOpen(false)}
            refreshList={() => fetchPayments({ reservationStatus: paymentStatus, paymentStatus: approvalStatus, sortOrder, keyword })}
          />
        )}
      </main>
    </div>
  );
}