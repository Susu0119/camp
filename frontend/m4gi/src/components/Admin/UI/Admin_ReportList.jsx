import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminReportModal from "./Admin_ReportModal";
import Pagination from './Admin_Pagination';
import SearchIcon from '@mui/icons-material/Search';

const getStatusLabel = (s) => {
  switch (Number(s)) {
    case 1: return <span className="text-red-600 font-semibold">처리대기</span>;
    case 2: return <span className="text-green-600 font-semibold">처리완료</span>;
    case 3: return <span className="text-gray-500 font-semibold">반려</span>;
    case 4: return <span className="text-purple-500 font-semibold">블라인드</span>;
    default: return <span className="text-gray-400">-</span>;
  }
};

export default function AdminReportList() {
  const itemsPerPage = 14;
  // [수정] 'filtered' 상태를 'reports'로 통일하고 중복 상태 제거
  const [reports, setReports] = useState([]);
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
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v !== null));
      const res = await axios.get("/web/admin/reports/search", { params: filteredParams });
      // [수정] setReports만 호출
      setReports(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ 신고 목록 불러오기 실패:", err);
      alert("데이터를 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchReports({ sortOrder: "DESC" });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports({ status, keyword, sortOrder, startDate, endDate });
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

  const handleRowClick = async (reportId) => {
    try {
      const res = await axios.get(`/web/admin/reports/${reportId}`);
      setSelectedDetail(res.data);
      setModalOpen(true);
    } catch (err) {
      alert("상세정보를 불러오는 데 실패했습니다.");
    }
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    fetchReports({ status, keyword, sortOrder: newSortOrder, startDate, endDate });
  };

  // [수정] 'reports' 상태를 직접 사용하여 페이지네이션 처리
  const paginatedReports = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(reports.length / itemsPerPage));

  return (
    <div className="bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-72">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">리뷰 신고 관리</h1>
          <p className="text-gray-500 mt-1">사용자가 신고한 리뷰를 확인하고 처리합니다.</p>
        </header>

        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <form onSubmit={handleSearch}>
            <div className="space-y-5">
              <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">신고일 조회</label>
                  <div className="flex items-center gap-2">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <span className="text-gray-500">~</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">처리 상태</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">전체 상태</option>
                    <option value="1">처리대기</option>
                    <option value="2">처리완료</option>
                    <option value="3">반려</option>
                    <option value="4">블라인드</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-200 gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <SearchIcon />
                    </span>
                    <input type="text" placeholder="캠핑장명 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <select value={sortOrder} onChange={handleSortChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="DESC">최신 신고순</option>
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-center font-medium">신고자</th>
                <th className="px-6 py-3 text-center font-medium">캠핑장</th>
                <th className="px-6 py-3 text-left font-medium">신고 사유</th>
                <th className="px-6 py-3 text-center font-medium">처리 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedReports.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-gray-500 py-16">신고 내역이 없습니다.</td></tr>
              ) : (
                paginatedReports.map((report) => (
                  <tr key={report.reportId} onClick={() => handleRowClick(report.reportId)} className="hover:bg-purple-50 transition cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-center">{report.reporterNickname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{report.campgroundName}</td>
                    <td className="px-6 py-4 text-left text-gray-600 max-w-sm truncate">{report.reportReason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{getStatusLabel(report.reportStatus)}</td>
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

        {modalOpen && selectedDetail && (
          <AdminReportModal
            isOpen={modalOpen}
            detail={selectedDetail}
            onClose={() => setModalOpen(false)}
            refreshList={() => fetchReports({ status, keyword, sortOrder, startDate, endDate })}
          />
        )}
      </main>
    </div>
  );
}