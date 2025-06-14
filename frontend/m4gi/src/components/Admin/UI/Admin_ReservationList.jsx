import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminReservationModal from "./Admin_ReservationModal";
import Pagination from './Admin_Pagination';
import SearchIcon from '@mui/icons-material/Search';

// --- 상태 라벨 컴포넌트 (변경 없음) ---
const getReservationStatusLabel = (status) => {
  switch (status) {
    case 1: return <span className="text-blue-600 font-semibold">예약완료</span>;
    case 2: return <span className="text-gray-500 font-semibold">예약취소</span>;
    default: return <span className="text-gray-400">-</span>;
  }
};

const getCheckinStatusLabel = (status) => {
  switch (status) {
    case 1: return <span className="text-yellow-600 font-semibold">입실전</span>;
    case 2: return <span className="text-green-600 font-semibold">입실완료</span>;
    case 3: return <span className="text-gray-600 font-semibold">퇴실완료</span>;
    default: return <span className="text-gray-400">-</span>;
  }
};

const getRefundStatusLabel = (status, type) => {
  if (status === 2) {
    return (
      <span className="flex items-center gap-1 justify-center">
        <span className="text-purple-600 font-semibold">환불완료</span>
        <span className={
          type === 0
            ? "inline-block bg-gray-200 text-black/60 text-xs px-2 py-0.5 rounded-full"
            : "inline-block bg-blue-200 text-blue-600 text-xs px-2 py-0.5 rounded-full"
        }>
          {type === 0 ? "자동" : "수동"}
        </span>
      </span>
    );
  }
  if (status === 1) return <span className="text-red-600 font-semibold">환불대기</span>;
  if (status === 3) return <span className="text-gray-500 font-semibold">환불거부</span>;
  if (status === 4) return <span className="text-pink-600 font-semibold">환불불가</span>;
  return <span className="text-gray-400">-</span>;
};


export default function AdminReservationList() {
  const itemsPerPage = 14;
  const [currentPage, setCurrentPage] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [name, setName] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");
  const [refundStatus, setRefundStatus] = useState("");
  const [checkinStatus, setCheckinStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => { fetchAllReservations(); }, []);
  useEffect(() => { setFilteredReservations(reservations); }, [reservations]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentPage]);

  const fetchAllReservations = () => {
    axios.get("/web/admin/reservations")
      .then((res) => {
        setReservations(res.data);
        setFilteredReservations(res.data);
      })
      .catch((err) => console.error("❌ 예약 목록 가져오기 실패:", err));
  };

  const fetchFilteredReservations = (params = {}) => {
    const currentParams = {
      name,
      reservationStatus: reservationStatus ? Number(reservationStatus) : "",
      refundStatus: refundStatus ? Number(refundStatus) : "",
      checkinStatus: checkinStatus ? Number(checkinStatus) : "",
      startDate,
      endDate,
      sortOrder,
      ...params
    };

    const filteredParams = Object.fromEntries(Object.entries(currentParams).filter(([, v]) => v !== ""));

    axios.get("/web/admin/reservations/search", { params: filteredParams })
      .then((res) => {
        setCurrentPage(1);
        setFilteredReservations(res.data);
      })
      .catch((err) => console.error("❌ 검색 실패:", err));
  };

  const resetFilters = () => {
    setName("");
    setReservationStatus("");
    setRefundStatus("");
    setStartDate("");
    setEndDate("");
    setCheckinStatus("");
    setSortOrder("DESC");
    fetchAllReservations();
  };

  const handleRowClick = async (id) => {
    try {
      const res = await axios.get(`/web/admin/reservations/${id}`);
      setSelectedDetail(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("❌ 예약 상세 조회 실패", err);
    }
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    fetchFilteredReservations({ sortOrder: newSortOrder });
  };

  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / itemsPerPage));
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-72">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">예약 관리</h1>
          <p className="text-gray-500 mt-1">모든 예약을 검색하고 관리합니다.</p>
        </header>

        {/* [수정] 필터 및 검색 카드 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <form onSubmit={(e) => { e.preventDefault(); fetchFilteredReservations(); }}>
            {/* [수정] 필터 섹션 구조 변경 */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
                {/* 조회 기간 그룹 */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">조회 기간</label>
                  <div className="flex items-center gap-2">
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <span className="text-gray-500">~</span>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                {/* 상태 필터 그룹 */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">상태 필터</label>
                  <div className="flex items-center flex-wrap gap-2">
                    <select value={checkinStatus} onChange={e => setCheckinStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">입실상태</option>
                      <option value="1">입실 전</option>
                      <option value="2">입실 완료</option>
                      <option value="3">퇴실 완료</option>
                    </select>
                    <select value={reservationStatus} onChange={e => setReservationStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">예약상태</option>
                      <option value="1">예약완료</option>
                      <option value="2">예약취소</option>
                    </select>
                    <select value={refundStatus} onChange={e => setRefundStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">환불상태</option>
                      <option value="1">환불대기</option>
                      <option value="2">환불완료</option>
                      <option value="3">환불거부</option>
                      <option value="4">환불불가</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* 검색 및 액션 그룹 */}
              <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-200 gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <SearchIcon />
                    </span>
                    <input type="text" placeholder="예약자명 or 캠핑장명" value={name} onChange={e => setName(e.target.value)} className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <select value={sortOrder} onChange={handleSortChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="DESC">최신순</option>
                    <option value="ASC">오래된 순</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors">검색</button>
                  <button type="button" onClick={resetFilters} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">초기화</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* 테이블 카드 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-center font-medium">예약자</th>
                <th className="px-6 py-3 text-center font-medium">캠핑장</th>
                <th className="px-6 py-3 text-center font-medium">입실상태</th>
                <th className="px-6 py-3 text-center font-medium">예약상태</th>
                <th className="px-6 py-3 text-center font-medium">환불상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedReservations.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-gray-500 py-16">예약 정보가 없습니다.</td></tr>
              ) : (
                paginatedReservations.map((item) => (
                  <tr key={item.reservationId} className="text-center hover:bg-purple-50 transition cursor-pointer" onClick={() => handleRowClick(item.reservationId)}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.userNickname}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.campgroundName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getCheckinStatusLabel(item.checkinStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getReservationStatusLabel(item.reservationStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getRefundStatusLabel(item.refundStatus, item.refundType)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={setCurrentPage}
                pageRange={2}
              />
            </div>
          )}
        </div>

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