import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminReportModal from "./Admin_ReportModal";

export default function AdminReportList() {
  const itemsPerPage = 14;
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const fetchReports = async (params = {}) => {
  try {
    const filteredParams = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ""));
    const res = await axios.get("/web/admin/reports/search", { params: filteredParams });
    setReports(res.data);
    setFiltered(res.data);
    setCurrentPage(1);
  } catch (err) {
    console.error("❌ 신고 목록 불러오기 실패:", err);
    alert("데이터 불러오기 실패");
  }
};

  const handleRowClick = async (reportId) => {
    try {
      const res = await axios.get(`/web/admin/reports/${reportId}`);
      setSelectedDetail(res.data);
      setModalOpen(true);
    } catch (err) {
      alert("상세정보 불러오기 실패");
    }
  };

  useEffect(() => {
    fetchReports({ sortOrder: "DESC" });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports({ status, keyword, sortOrder, startDate, endDate });
  };

  const getStatusLabel = (s) => {
    switch (Number(s)) {
      case 1: return <span className="text-red-500">처리대기</span>;
      case 2: return <span className="text-blue-500">처리완료</span>;
      case 3: return <span className="text-gray-400">반려</span>;
      case 4: return <span className="text-purple-500">블라인드</span>;
      default: return <span className="text-gray-400">-</span>;
    }
  };

  const resetFilters = () => {
    setStatus("");
    setKeyword("");
    setSortOrder("DESC");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    fetchReports({ sortOrder: "DESC" });
  };

  const paginatedReports = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  return (
    <div className="min-h-screen bg-gray-10 flex select-none">
      <Sidebar />
      <main className="flex-1 px-8 py-6 max-w-screen-2xl mx-auto">
        <h1 className="text-4xl text-purple-900/70 mt-4 mb-6">리뷰 신고 관리</h1>
        <form onSubmit={handleSearch} className="mb-6 p-4 text-black/70 border border-gray-200 shadow-sm rounded-xl bg-white flex flex-col gap-4">
          <div className="flex flex-wrap justify-end gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none"
            />
            <span className="self-center text-sm text-gray-400">~</span>
          <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none"
          />
            <select
               value={sortOrder}
               onChange={(e) => 
               {const value = e.target.value;
                setSortOrder(value);
                fetchReports({
                  status,
                  keyword,
                  sortOrder: value,
                  startDate,
                  endDate,

                });
               }}
               className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="DESC">최신 신고순</option>
              <option value="ASC">오래된 순</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
              <option value="">전체 상태</option>
              <option value="1">처리대기</option>
              <option value="2">처리완료</option>
              <option value="3">반려</option>
              <option value="4">블라인드</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <input type="text" name="keyword" placeholder="캠핑장명 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="bg-purple-300/30 px-4 py-1 rounded-xl w-60 focus:outline-none shadow-sm" />
            <button type="submit" className="bg-purple-900/80 hover:bg-purple-900/90 text-white px-6 py-2 rounded-lg shadow-sm cursor-pointer">검색</button>
            <button type="button" onClick={resetFilters} className="bg-gray-400/50 hover:bg-gray-400/80 text-black/70 px-4 py-2 rounded-lg shadow-sm cursor-pointer">초기화</button>
          </div>
        </form>

        <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
          <table className="w-full border-collapse text-lg text-black/80">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">신고자명</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">캠핑장명</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">신고사유</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center align-middle">처리상태</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-gray-400 py-4">신고 내역이 없습니다.</td></tr>
              ) : (
                paginatedReports.map((report) => (
                  <tr key={report.reportId}
                    onClick={() => handleRowClick(report.reportId)}
                    className="hover:bg-purple-100 text-center cursor-pointer">
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap align-middle">{report.reporterNickname || report.reporterId}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap align-middle">{report.campgroundName}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap align-middle text-sm truncate">{report.reportReason}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap align-middle">{getStatusLabel(report.reportStatus)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 gap-2 text-lg">
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>{'<<'}</button>
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>{'<'}</button>
          {[...Array(totalPages).keys()].map(i => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-9 w-9 flex items-center justify-center rounded-full cursor-pointer transition text-purple-900/70 ${currentPage === i + 1 ? 'bg-purple-100 text-purple-900/70' : 'hover:bg-purple-100 hover:shadow-sm'}`}>{i + 1}</button>
          ))}
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>{'>'}</button>
          <button className="cursor-pointer text-purple-900/70" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>{'>>'}</button>
        </div>

        {modalOpen && selectedDetail && (
          <AdminReportModal
            isOpen={modalOpen}
            detail={selectedDetail}
            onClose={() => setModalOpen(false)}
            refreshList={() => fetchReports({ status, keyword, sortOrder })}
          />
        )}
      </main>
    </div>
  );
}
