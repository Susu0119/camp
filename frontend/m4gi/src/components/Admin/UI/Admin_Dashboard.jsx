import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiCore } from '../../../utils/Auth';
import Loading from '../../../utils/Loading';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { getKSTDateTime } from '../../../utils/KST';

// --- 유틸리티 및 하위 컴포넌트 ---

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-3 rounded-lg shadow-md text-gray-800">
        <p className="font-bold mb-2 text-base border-b pb-1">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx} style={{ color: item.color }} className="text-sm font-semibold">
            <span className="font-semibold">{item.name}:</span> {item.value}건
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ label, value, subValue, icon, actionIcon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between transition-shadow shadow-sm">
      <div className="flex items-center">
        <div className="mr-4 text-gray-400">
          {icon}
        </div>
        <div>
          <p className="text-base font-semibold text-gray-600">{label}</p>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-800">{value}</span>
            {subValue && <span className="text-sm text-gray-500 ml-1.5">{subValue}</span>}
          </div>
        </div>
      </div>
      {actionIcon && <button className="text-gray-400 hover:text-gray-600 transition-colors">{actionIcon}</button>}
    </div>
  );
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  if (percent === 0) {
    return null;
  }

  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const textAnchor = x > cx ? 'start' : 'end';

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={textAnchor}
      dominantBaseline="central"
      className="text-xs font-semibold pointer-events-none"
    >
      {`${name} ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};


// --- 메인 대시보드 컴포넌트 ---
export default function AdminDashboard() {
  // 원본 데이터 상태 (영문 변수명으로 변경)
  const [annualStats, setAnnualStats] = useState({ reservation: 0, refund: 0, cancel: 0 });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [todayStats, setTodayStats] = useState({ reservation: 0, refund: 0, cancel: 0 });
  const [loading, setLoading] = useState(true);

  // [추가] 필터링을 위한 상태
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'monthly'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [displayedStats, setDisplayedStats] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await apiCore.get("/admin/reservations");
        const all = res.data;
        // 연간 통계 (영문 변수명)
        setAnnualStats({
          reservation: all.filter(r => r.reservationStatus === 1).length,
          refund: all.filter(r => r.refundStatus === 2).length,
          cancel: all.filter(r => r.reservationStatus === 2).length,
        });
        // 월별 통계 (영문 변수명)
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const monthMap = {};
        all.forEach(r => {
          const date = r.checkinTime || r.reservationDate;
          if (!date) return;
          const month = new Date(date).getMonth() + 1;
          if (!monthMap[month]) monthMap[month] = { reservationCount: 0, refundCount: 0, cancelCount: 0 };
          if (r.reservationStatus === 1) monthMap[month].reservationCount++;
          if (r.refundStatus === 2) monthMap[month].refundCount++;
          if (r.reservationStatus === 2) monthMap[month].cancelCount++;
        });
        const monthlyArr = [];
        for (let m = 1; m <= currentMonth; m++) {
          monthlyArr.push({
            month: `${m}월`,
            reservationCount: monthMap[m]?.reservationCount || 0,
            refundCount: monthMap[m]?.refundCount || 0,
            cancelCount: monthMap[m]?.cancelCount || 0,
          });
        }
        setMonthlyStats(monthlyArr);
        // 오늘 통계 (KST 기준으로 날짜 비교, 디버깅용 콘솔 추가)
        const today = new Date();
        const todayKST = getKSTDateTime(today).slice(0, 10); // YYYY-MM-DD
        const isTodayKST = (date) => {
          if (!date) return false;
          const d = new Date(date);
          return getKSTDateTime(d).slice(0, 10) === todayKST;
        };
        setTodayStats({
          reservation: all.filter(r => isTodayKST(r.createdAt)).length,
          refund: all.filter(r => isTodayKST(r.refundedAt)).length,
          cancel: all.filter(r => r.reservationStatus === 2 && isTodayKST(r.createdAt)).length,
        });
      } catch (e) {
        console.error("Failed to fetch stats:", e);
        setAnnualStats({ reservation: 0, refund: 0, cancel: 0 });
        setMonthlyStats([]);
        setTodayStats({ reservation: 0, refund: 0, cancel: 0 });
      } finally {
        setTimeout(() => setLoading(false), 5000);
      }
    }
    fetchStats();
  }, []);

  // [추가] 필터링 로직을 처리하는 useEffect (영문 변수명 반영)
  useEffect(() => {
    if (filterMode === 'all') {
      setDisplayedStats(monthlyStats);
    } else {
      const filtered = monthlyStats.filter(stat => parseInt(stat.month) === selectedMonth);
      setDisplayedStats(filtered);
    }
  }, [filterMode, selectedMonth, monthlyStats]);

  // 통계 계산 (영문 변수명 반영)
  const totalActions = annualStats.reservation + annualStats.refund + annualStats.cancel;
  const refundRate = totalActions === 0 ? 0 : Math.round((annualStats.refund / totalActions) * 100);

  const PIE_COLORS = ["#7b2ff2", "#fe879c", "#e2e2e2"];
  const pieData = [
    { name: "예약", value: annualStats.reservation },
    { name: "환불", value: annualStats.refund },
    { name: "취소", value: annualStats.cancel },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-gray-50 via-gray-50 to-purple-50 p-4 sm:p-6 lg:p-8 select-none">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <header className="mb-8 mt-6">
          <h1 className="text-3xl font-bold text-gray-800">대시보드</h1>
          <p className="text-gray-500 mt-1">실시간 사용 현황과 각종 이력을 확인할 수 있습니다.</p>
        </header>

        {/* TODAY 섹션 */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard label="오늘 예약" value={todayStats.reservation} subValue="건" icon={<CheckCircleOutlineRoundedIcon fontSize="large" />} />
            <StatCard label="오늘 환불" value={todayStats.refund} subValue="건" icon={<LoopRoundedIcon fontSize="large" />} />
            <StatCard label="오늘 취소" value={todayStats.cancel} subValue="건" icon={<HighlightOffRoundedIcon fontSize="large" />} />
            <StatCard label="연간 환불 비율" value={`${refundRate}%`} icon={<ErrorOutlineRoundedIcon fontSize="large" />} />
          </div>
        </section>

        {/* 차트 섹션 */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 도넛 차트 */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 transition-shadow shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">연간 현황</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    stroke="none"
                    labelLine={true}
                    label={renderCustomizedLabel}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-8 pt-6 border-t">
              {["예약", "환불", "취소"].map((name, idx) => (
                <div key={name} className="flex items-center gap-2">
                  <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "3px", background: PIE_COLORS[idx] }} />
                  <span className="text-sm font-medium text-gray-600">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 월간 막대 그래프 */}
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg p-6 transition-shadow shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">월별 통계</h3>
              {/* [수정] 필터 UI 및 로직 연결 */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer ${filterMode === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  전체 보기
                </button>
                <button
                  onClick={() => setFilterMode('monthly')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer ${filterMode === 'monthly'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  월별 필터
                </button>
                {filterMode === 'monthly' && (
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="px-2 py-1 text-xs border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    {monthlyStats.map(stat => (
                      <option key={stat.month} value={parseInt(stat.month)}>
                        {stat.month}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                {/* [수정] 차트에 표시될 데이터를 displayedStats로 변경 */}
                <BarChart data={displayedStats} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
                  <Bar dataKey="reservationCount" fill="#7b2ff2" name="예약" radius={[4, 4, 0, 0]} barSize={15} />
                  <Bar dataKey="refundCount" fill="#fe879c" name="환불" radius={[4, 4, 0, 0]} barSize={15} />
                  <Bar dataKey="cancelCount" fill="#e2e2e2" name="취소" radius={[4, 4, 0, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 관리자 페이지 이동 버튼 */}
        <div className="w-full flex justify-end mt-8">
          <Link to="/admin/reservations">
            <button className="px-5 py-2.5 bg-white border border-gray-200 text-purple-700 font-semibold rounded-md shadow hover:bg-purple-50 transition-all duration-150 cursor-pointer">
              관리자 페이지 이동
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}