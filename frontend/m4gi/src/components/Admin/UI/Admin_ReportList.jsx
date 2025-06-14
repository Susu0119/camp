import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminReportModal from "./Admin_ReportModal";
import Pagination from './Admin_Pagination';
import SearchIcon from '@mui/icons-material/Search';

// 상태 라벨 컴포넌트 (변경 없음)
const getStatusLabel = (s) => {
  switch (Number(s)) {
    case 1: return <span className="text-red-600 font-semibold">처리대기</span>;
    case 2: return <span className="text-green-600 font-semibold">처리완료</span>;
    case 3: return <span className="text-gray-500 font-semibold">반려</span>;
    case 4: return <span className="text-purple-500 font-semibold">블라인드</span>;
    default: return <span className="text-gray-400">-</span>;
  }
};

// 스켈레톤 UI 컴포넌트
const Skeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div></td>
  </tr>
);

export default function AdminReportList() {
  const itemsPerPage = 14;

  // --- 상태 관리 ---
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  // [개선] 필터 상태를 하나의 객체로 통합
  const initialFilters = {
    status: "",
    keyword: "",
    sortOrder: "DESC",
    startDate: "",
    endDate: "",
  };
  const [filters, setFilters] = useState(initialFilters);

  // [개선] 데이터 요청 함수를 useCallback으로 최적화
  const fetchReports = useCallback(async (currentFilters) => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(Object.entries(currentFilters).filter(([, v]) => v !== "" && v !== null));
      const res = await axios.get("/web/admin/reports/search", { params: filteredParams });
      setReports(Array.isArray(res.data) ? res.data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ 신고 목록 불러오기 실패:", err);
      alert("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, []);

  // 최초 렌더링 시 데이터 로드
  useEffect(() => {
    fetchReports(filters);
  }, [fetchReports]);

  // [개선] 통합된 필터 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports(filters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    fetchReports(initialFilters);
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    // 상태 업데이트 후 콜백 함수에서 fetch 호출하여 최신 상태 보장
    setFilters(prev => {
        const newFilters = { ...prev, sortOrder: newSortOrder };
        fetchReports(newFilters);
        return newFilters;
    });
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

  const paginatedReports = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(reports.length / itemsPerPage));

  return (
    <div className="bg-slate-50 min-h-screen select-none">
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
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <span className="text-gray-500">~</span>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">처리 상태</label>
                  <select name="status" value={filters.status} onChange={handleFilterChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                    <input type="text" name="keyword" placeholder="캠핑장명 검색" value={filters.keyword} onChange={handleFilterChange} className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <select name="sortOrder" value={filters.sortOrder} onChange={handleSortChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="DESC">최신 신고순</option>
                    <option value="ASC">오래된 순</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors cursor-pointer">검색</button>
                  <button type="button" onClick={resetFilters} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">초기화</button>
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
              {isLoading ? (
                Array.from({ length: 14 }).map((_, index) => <Skeleton key={index} />)
              ) : paginatedReports.length === 0 ? (
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
          {!isLoading && totalPages > 1 && (
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
            refreshList={() => fetchReports(filters)}
          />
        )}
      </main>
    </div>
  );
}