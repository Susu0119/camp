import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminPaymentModal from "./Admin_PaymentModal";
import Pagination from './Admin_Pagination';
import SearchIcon from '@mui/icons-material/Search';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- 상태 라벨 및 포맷터 (변경 없음) ---
const getPaymentStatusLabel = (s) => {
  switch (Number(s)) {
    case 2: return <span className="text-blue-600 font-semibold">결제완료</span>;
    case 3: return <span className="text-gray-500 font-semibold">결제취소</span>;
    default: return <span className="text-gray-400">-</span>;
  }
};

const getApprovalStatusLabel = (status) => {
  if (status === null || status === undefined) return <span className="text-gray-400">-</span>;
  switch (Number(status)) {
    case 1: return <span className="text-red-500 font-semibold">승인대기</span>;
    case 2: return <span className="text-green-500 font-semibold">승인됨</span>;
    case 3: return <span className="text-gray-500 font-semibold">승인거절됨</span>;
    case 4: return <span className="text-purple-500 font-semibold">환불불가</span>;
    default: return <span className="text-gray-400">-</span>;
  }
};

const formatDate = (raw) => {
  if (!raw) return "-";
  if (Array.isArray(raw) && raw.length >= 3) {
    const [year, month, day] = raw;
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? "-" : date.toISOString().split("T")[0];
  }
  const date = new Date(raw);
  return isNaN(date.getTime()) ? "-" : date.toISOString().split("T")[0];
};

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-3 rounded-lg shadow-md">
        <p className="font-bold text-gray-700">{`${label}`}</p>
        <p className="text-sm text-purple-600 font-semibold">
          매출: {payload[0].value.toLocaleString()}원
        </p>
      </div>
    );
  }
  return null;
};

// 스켈레톤 UI 컴포넌트
const Skeleton = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div></td>
    </tr>
);

// [신규] 차트의 기본 날짜 범위를 반환하는 함수 (최근 30일)
const getInitialChartDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29);
    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
    };
};

export default function AdminPaymentList() {
  const itemsPerPage = 14;
  
  // --- 상태 관리 ---
  // 메인 테이블 관련 상태
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [filters, setFilters] = useState({
    paymentStatus: "",
    approvalStatus: "",
    sortOrder: "DESC",
    keyword: "",
    startDate: "",
    endDate: "",
  });

  // [신규] 차트 전용 상태
  const [chartData, setChartData] = useState([]);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [chartFilters, setChartFilters] = useState(getInitialChartDates());

  // --- 데이터 요청 로직 ---
  // 메인 테이블 데이터 요청 함수
  const fetchPayments = useCallback(async (currentFilters) => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(Object.entries(currentFilters).filter(([, v]) => v !== "" && v !== null));
      const res = await axios.get("/web/admin/payments", { params: filteredParams });
      setPayments(Array.isArray(res.data) ? res.data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ 결제 목록 불러오기 실패:", err);
      alert("데이터를 불러오는 데 실패했습니다.");
      setPayments([]);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, []);

  // [신규] 차트 데이터 요청 함수
  const fetchChartData = useCallback(async (currentChartFilters) => {
    setIsChartLoading(true);
    try {
        const params = {
            ...currentChartFilters,
            paymentStatus: 2, // 매출 통계는 '결제완료' 상태만 조회
        };
        const res = await axios.get("/web/admin/payments", { params });
        const paymentsData = Array.isArray(res.data) ? res.data : [];

        // 받아온 데이터로 차트 데이터 가공
        const salesByDate = {};
        paymentsData.forEach(p => {
            const date = formatDate(p.paidAt);
            if (date !== "-") {
                salesByDate[date] = (salesByDate[date] || 0) + p.paymentPrice;
            }
        });
        const processedData = Object.entries(salesByDate)
            .map(([date, total]) => ({ date, total }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setChartData(processedData);
    } catch (err) {
        console.error("❌ 차트 데이터 불러오기 실패:", err);
        setChartData([]); // 에러 발생 시 차트 데이터 비우기
    } finally {
        setTimeout(() => setIsChartLoading(false), 1000);
    }
  }, []);

  // 최초 로딩 시 테이블과 차트 데이터 모두 요청
  useEffect(() => {
    fetchPayments(filters);
    fetchChartData(chartFilters);
  }, [fetchPayments, fetchChartData]);

  // --- 핸들러 함수 ---
  // 메인 필터 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPayments(filters);
  };
  
  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setFilters(prev => {
        const newFilters = { ...prev, sortOrder: newSortOrder };
        fetchPayments(newFilters);
        return newFilters;
    });
  };

  const resetFilters = () => {
    const initialFilters = {
        paymentStatus: "", approvalStatus: "", sortOrder: "DESC",
        keyword: "", startDate: "", endDate: "",
    };
    setFilters(initialFilters);
    fetchPayments(initialFilters);
  };

  const handleRowClick = async (paymentId) => {
    try {
      const res = await axios.get(`/web/admin/payments/${paymentId}`);
      setSelectedDetail(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("상세 정보 불러오기 실패:", err);
      alert("상세정보를 불러오는 데 실패했습니다.");
    }
  };
  
  // [신규] 차트 필터 핸들러
  const handleChartFilterChange = (e) => {
    const { name, value } = e.target;
    setChartFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleChartSearch = (e) => {
    e.preventDefault();
    fetchChartData(chartFilters);
  };


  // --- 렌더링을 위한 변수 ---
  const paginatedPayments = payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(payments.length / itemsPerPage));


  return (
    <div className="bg-slate-50 min-h-screen select-none">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-72">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">결제 관리</h1>
          <p className="text-gray-500 mt-1">결제 및 환불 내역을 검색하고 관리합니다.</p>
        </header>

        {/* --- 테이블 필터링 UI --- */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <form onSubmit={handleSearch}>
            <div className="space-y-5">
                <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">결제일 조회 (테이블)</label>
                    <div className="flex items-center gap-2">
                      <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      <span className="text-gray-500">~</span>
                      <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">상태 필터 (테이블)</label>
                    <div className="flex items-center flex-wrap gap-2">
                      <select name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">전체 결제상태</option>
                        <option value="2">결제완료</option>
                        <option value="3">결제취소</option>
                      </select>
                      <select name="approvalStatus" value={filters.approvalStatus} onChange={handleFilterChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">전체 승인상태</option>
                        <option value="1">승인대기</option>
                        <option value="2">승인됨</option>
                        <option value="3">승인거절됨</option>
                        <option value="4">환불불가</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-200 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                      <input type="text" name="keyword" placeholder="사용자명 검색" value={filters.keyword} onChange={handleFilterChange} className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <select name="sortOrder" value={filters.sortOrder} onChange={handleSortChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="DESC">최신 결제순</option>
                      <option value="ASC">오래된 결제순</option>
                      <option value="priceDesc">금액 높은순</option>
                      <option value="priceAsc">금액 낮은순</option>
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

        {/* --- 결제 내역 테이블 --- */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-center font-medium">예약자</th>
                <th className="px-6 py-3 text-center font-medium">캠핑장</th>
                <th className="px-6 py-3 text-center font-medium">결제금액</th>
                <th className="px-6 py-3 text-center font-medium">결제상태</th>
                <th className="px-6 py-3 text-center font-medium">결제일</th>
                <th className="px-6 py-3 text-center font-medium">승인상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 14 }).map((_, index) => <Skeleton key={index} />)
              ) : paginatedPayments.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-gray-500 py-16">결제 내역이 없습니다.</td></tr>
              ) : (
                paginatedPayments.map((pay) => (
                  <tr key={pay.paymentId} onClick={() => handleRowClick(pay.paymentId)} className="hover:bg-purple-50 transition cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-center">{pay.userNickname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{pay.campgroundName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-semibold">{pay.paymentPrice.toLocaleString()}원</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{getPaymentStatusLabel(pay.paymentStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">{formatDate(pay.paidAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{getApprovalStatusLabel(pay.refundStatus)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!isLoading && totalPages > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} pageRange={2} />
            </div>
          )}
        </div>
        
        {/* --- 일별 매출 현황 차트 --- */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <h3 className="text-lg font-semibold text-gray-800">일별 매출 현황</h3>
            <form onSubmit={handleChartSearch} className="flex items-center gap-2">
                <input type="date" name="startDate" value={chartFilters.startDate} onChange={handleChartFilterChange} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
                <span className="text-gray-500">~</span>
                <input type="date" name="endDate" value={chartFilters.endDate} onChange={handleChartFilterChange} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
                <button type="submit" className="px-4 py-1.5 bg-purple-600 text-white font-semibold rounded-lg text-sm shadow-sm hover:bg-purple-700 transition-colors">조회</button>
            </form>
          </div>
          <div className="relative" style={{ height: '300px' }}>
            {isChartLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10 rounded-lg">
                    <p className="text-gray-500 font-semibold">차트 데이터를 불러오는 중입니다...</p>
                </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} interval={3} tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}/>
                <YAxis tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- 모달 --- */}
        {modalOpen && selectedDetail && (
          <AdminPaymentModal
            isOpen={modalOpen}
            detail={selectedDetail}
            onClose={() => setModalOpen(false)}
            refreshList={() => fetchPayments(filters)}
          />
        )}
      </main>
    </div>
  );
}