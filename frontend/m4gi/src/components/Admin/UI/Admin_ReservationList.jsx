import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminReservationModal from "./Admin_ReservationModal";

// ✅ 상태 라벨 + 색상 통합
const getReservationStatusLabel = (status) => {
  switch (status) {
    case 1: return <span className="text-green-500">예약완료</span>;
    case 2: return <span className="text-gray-400">예약취소</span>;
    default: return <span className="text-gray-400">-</span>;
  }
};

const getRefundStatusLabel = (status) => {
  switch (status) {
    case 1: return <span className="text-red-500">환불대기</span>;
    case 2: return <span className="text-purple-400">환불완료</span>;
    case 3: return <span className="text-gray-400">환불거부</span>;
    case 4: return <span className="text-gray-400">환불불가</span>;
    default: return <span className="text-gray-500">-</span>;
  }
};

const getCheckinStatusLabel = (status) => {
  switch (status) {
    case 1: return <span className="text-yellow-400">입실전</span>;
    case 2: return <span className="text-green-500">입실완료</span>;
    case 3: return <span className="text-gray-400">퇴실완료</span>;
    default: return <span className="text-gray-500">-</span>;
  }
};

export default function AdminReservationList() {
  const itemsPerPage = 18;
  const [currentPage, setCurrentPage] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [name, setName] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");
  const [refundStatus, setRefundStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [checkinStatus, setCheckinStatus] = useState("");

  useEffect(() => {
    fetchAllReservations();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const fetchAllReservations = () => {
    axios.get("/web/admin/reservations")
      .then((res) => setReservations(res.data))
      .catch((err) => console.error("\u274C 예약 목록 가져오기 실패:", err));
  };

  const resetFilters = () => {
    setName("");
    setReservationStatus("");
    setRefundStatus("");
    setStartDate("");
    setEndDate("");
    fetchAllReservations();
  };

  const handleRowClick = async (id) => {
    try {
      const res = await axios.get(`/web/admin/reservations/${id}`);
      setSelectedDetail(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("\u274C 예약 상세 조회 실패", err);
    }
  };

  const fetchFilteredReservations = () => {
    const params = {};
    if (name) params.name = name;
    if (reservationStatus) params.reservationStatus = Number(reservationStatus);
    if (refundStatus) params.refundStatus = Number(refundStatus);
    if (sortOrder) params.sortOrder = sortOrder;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (checkinStatus) params.checkinStatus = Number(checkinStatus);

    axios.get("/web/admin/reservations/search", { params })
      .then((res) => {
        setCurrentPage(1);
        setReservations(res.data);
      })
      .catch((err) => console.error("\u274C 검색 실패:", err));
  };

  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const paginatedReservations = reservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-10 flex select-none">
      <Sidebar />
      <main className="flex-1 px-8 py-6 max-w-screen-2xl mx-auto">
        <h2 className="text-4xl text-purple-900/70 mt-4 mb-6">예약 목록</h2>

        {/* 🔍 필터 영역 */}
        <form
          onSubmit={(e) => { e.preventDefault(); fetchFilteredReservations(); }}
          className="mb-6 p-4 text-black/70 border border-gray-200 shadow-sm rounded-xl bg-white flex flex-col gap-4"
        >
          <div className="flex flex-wrap justify-end gap-4">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none" />
            <span className="text-gray-400 text-sm self-center">~</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none" />

            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
              <option value="DESC">최신순</option>
              <option value="ASC">오래된 순</option>
            </select>

            <select onChange={e => setCheckinStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
              <option value="">입실상태</option>
              <option value="1">입실 전</option>
              <option value="2">입실 완료</option>
              <option value="3">퇴실 완료</option>
            </select>

            <select value={reservationStatus} onChange={e => setReservationStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
              <option value="">예약상태</option>
              <option value="1">예약완료</option>
              <option value="2">예약취소</option>
            </select>

            <select value={refundStatus} onChange={e => setRefundStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
              <option value="">환불상태</option>
              <option value="1">환불대기</option>
              <option value="2">환불완료</option>
              <option value="3">환불거부</option>
              <option value="4">환불불가</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <input type="text" name="keyword" placeholder="이름 or 이메일" value={name} onChange={e => setName(e.target.value)} className="bg-purple-300/30 px-4 py-1 rounded-xl w-60 focus:outline-none shadow-sm text-start" />
            <button type="submit" className="bg-purple-900/80 hover:bg-purple-900/90 text-white px-6 py-2 rounded-lg shadow-sm cursor-pointer">검색</button>
            <button type="button" onClick={resetFilters} className="bg-gray-400/50 hover:bg-gray-400/80 text-black/70 px-4 py-2 rounded-lg shadow-sm cursor-pointer">초기화</button>
          </div>
        </form>

        {/* 📋 예약 리스트 테이블 */}
        <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
          <table className="w-full border-collapse text-lg text-black/80">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">예약자명</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">캠핑장</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">입실상태</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">예약상태</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">환불상태</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-4">예약 정보가 없습니다.</td>
                </tr>
              ) : (
                paginatedReservations.map((item, idx) => (
                  <tr key={idx} className="text-center hover:bg-purple-100 transition cursor-pointer" 
                  onClick={() => handleRowClick(item.reservationId)}>
                    <td className="border-b border-gray-300 px-6 py-4 whitespace-nowrap align-middle">{item.userNickname}</td>
                    <td className="border-b border-gray-300 px-6 py-4 whitespace-nowrap align-middle">{item.campgroundName}</td>
                    <td className="border-b border-gray-300 px-6 py-4 whitespace-nowrap align-middle">{getCheckinStatusLabel(item.checkinStatus)}</td>
                    <td className="border-b border-gray-300 px-6 py-4 whitespace-nowrap align-middle">{getReservationStatusLabel(item.reservationStatus)}</td>
                    <td className="border-b border-gray-300 px-6 py-4 whitespace-nowrap align-middle">{getRefundStatusLabel(item.refundStatus)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ⏩ 페이지네이션 */}
        <div className="flex justify-center mt-6 gap-2 text-lg">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>{'<<'}</button>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>{'<'}</button>
          {[...Array(totalPages).keys()].map((i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`h-9 w-9 flex items-center justify-center rounded-full cursor-pointer transition text-purple-900/70 ${currentPage === i + 1 ? 'bg-purple-100' : 'hover:bg-purple-100 hover:shadow-sm'}`}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>{'>'}</button>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>{'>>'}</button>
        </div>

        {/* 🪟 상세 모달 */}
        {modalOpen && (
          <AdminReservationModal
            key={selectedDetail?.reservationId}
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedDetail(null);
            }}
            detail={selectedDetail}
            refreshList={fetchAllReservations}
          />
        )}
      </main>
    </div>
  );
}