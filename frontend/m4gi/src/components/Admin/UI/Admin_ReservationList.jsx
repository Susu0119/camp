import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminReservationModal from "./Admin_ReservationModal"; 

const getReservationStatusText = (status) => {
  switch (status) {
    case 1: return "예약완료";
    case 2: return "예약취소";
    default: return "-";
  }
};

const getReservationColor = (status) => {
  switch (status) {
    case 1: return "text-green-500";
    case 2: return "text-gray-400";
    default: return "";
  }
};

const getRefundLabel = (status) => {
  switch (status) {
    case 1: return "환불대기";
    case 2: return "환불완료";
    case 3: return "환불거부";
    case 4: return "환불불가";
    default: return "-";
  }
};

const getStateColor = (status) => {
  switch (status) {
    case 1: return "text-red-500";
    case 2: return "text-purple-300";
    case 3: return "text-gray-400";
    case 4: return "text-gray-400";
    default: return "text-gray-500";
  }
};

const getCheckinStatusColor = (status) => {
  switch (status) {
    case "입실전": return "text-yellow-400";
    case "입실완료": return "text-green-500";
    case "퇴실완료": return "text-gray-400";
    default: return "text-gray-500";
  }
};

const formatDate = (raw) => {
  if (!raw) return "";
  const date = new Date(raw);
  if (isNaN(date)) return "";
  return date.toISOString().slice(0, 10);
};

export default function AdminReservationList() {
  const itemsPerPage = 18;
  const [currentPage, setCurrentPage] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [name, setName] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");
  const [refundStatus, setRefundStatus] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [sortOrder, setSortOrder] = useState("DESC");

  useEffect(() => {
    fetchAllReservations();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const fetchAllReservations = () => {
    axios.get("/web/admin/reservations")
      .then((res) => setReservations(res.data))
      .catch((err) => console.error("❌ 예약 목록 가져오기 실패:", err));
  };

  const resetFilters = () => {
    setName("");
    setReservationStatus("");
    setRefundStatus("");
    setCheckinDate("");
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

  const fetchFilteredReservations = () => {
  const params = {};
  if (name) params.name = name;
  if (reservationStatus) params.reservationStatus = Number(reservationStatus);
  if (refundStatus) params.refundStatus = Number(refundStatus);
  if (checkinDate) params.checkinDate = checkinDate;
  if (sortOrder) params.sortOrder = sortOrder; // 추가됨!

  axios.get("/web/admin/reservations/search", { params })
    .then((res) => {
      setCurrentPage(1);
      setReservations(res.data);
    })
    .catch((err) => console.error("❌ 검색 실패:", err));
};


  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const paginatedReservations = reservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-10 flex select-none">
      <Sidebar />
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        <h2 className="text-4xl text-purple-900/70 mt-4 mb-6">예약 목록</h2>

        <form onSubmit={(e) => { e.preventDefault(); fetchFilteredReservations(); }} className="mb-6 p-4 text-black/70 border border-gray-200 shadow-sm rounded-xl bg-white flex flex-wrap justify-end gap-4">
          <input type="date" value={checkinDate} onChange={(e) => setCheckinDate(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none" />
          <select value={reservationStatus} onChange={(e) => setReservationStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
            <option value="">전체</option>
            <option value="1">예약완료</option>
            <option value="2">예약취소</option>
          </select>
          <select value={refundStatus} onChange={(e) => setRefundStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
            <option value="">전체</option>
            <option value="1">환불대기</option>
            <option value="2">환불완료</option>
            <option value="3">환불거부</option>
            <option value="4">환불불가</option>
          </select>

        <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none"
        >
           <option value="DESC">최신순</option>
           <option value="ASC">오래된 순</option>
        </select>

          
          <input type="text" placeholder="예약자명 검색" value={name} onChange={(e) => setName(e.target.value)} className="bg-purple-300/30 px-4 py-1 rounded-xl w-60 focus:outline-none shadow-sm text-start" />
          <button type="submit" className="bg-purple-900/80 hover:bg-purple-900/90 cursor-pointer text-white px-6 py-2 rounded-lg shadow-sm">검색</button>
          <button type="button" onClick={resetFilters} className="bg-gray-400/50 hover:bg-gray-400/80 cursor-pointer text-black/70 px-4 py-2 rounded-lg shadow-sm">초기화</button>
        </form>

        <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
          <table className="w-full border-collapse text-lg text-black/80">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-gray-200 px-4 py-2 text-center align-middle">번호</th>
                <th className="border-b border-gray-200 px-4 py-2 text-center align-middle">예약자명</th>
                <th className="border-b border-gray-200 px-4 py-2 text-center align-middle">캠핑장</th>
                <th className="border-b border-gray-200 px-4 py-2 text-center align-middle">입실상태</th>
                <th className="border-b border-gray-200 px-4 py-2 text-center align-middle">예약상태</th>
                <th className="px-4 py-2 text-center align-middle">환불상태</th>
              </tr>
            </thead>

            <tbody>
              {paginatedReservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-4">예약 정보가 없습니다.</td>
                </tr>
              ) : (
                paginatedReservations.map((item, idx) => (
                  <tr
                    key={idx}
                    className="text-center hover:bg-purple-100 transition cursor-pointer"
                    onClick={() => handleRowClick(item.reservationId)}
                  >
                    <td className="border-b border-gray-300 px-4 py-2 text-center align-middle">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2 text-center align-middle">
                      {item.userNickname}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2 text-center align-middle">
                      {item.campgroundName}
                    </td>
                    <td className={`border-b border-gray-300 px-4 py-2 text-center align-middle ${getCheckinStatusColor(item.checkinStatus)}`}>
                      {item.checkinStatus}
                    </td>
                    <td className={`border-b border-gray-300 px-4 py-2 font-semibold text-center align-middle ${getReservationColor(item.reservationStatus)}`}>
                      {getReservationStatusText(item.reservationStatus)}
                    </td>
                    <td className={`border-b border-gray-300 px-4 py-2 font-semibold text-center align-middle ${getStateColor(item.refundStatus)}`}>
                      {getRefundLabel(item.refundStatus)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 gap-2 text-lg">
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>{'<<'}</button>
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>{'<'}</button>
          {[...Array(totalPages).keys()].map((i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`h-9 w-9 flex items-center justify-center rounded-full cursor-pointer transition text-purple-900/70 ${currentPage === i + 1 ? 'bg-purple-100 text-purple-900/70' : 'hover:bg-purple-100 hover:shadow-sm'}`}
            >
              {i + 1}
            </button>
          ))}
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>{'>'}</button>
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>{'>>'}</button>
        </div>

        {modalOpen && (
          <AdminReservationModal
            key={selectedDetail?.reservationId} // 강제 리렌더링 유도도
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedDetail(null);
            }}
            detail={selectedDetail}
            refreshList={fetchAllReservations} // 리스트 갱신에 필수수
          />
        )}
      </main>
    </div>
  );
}
