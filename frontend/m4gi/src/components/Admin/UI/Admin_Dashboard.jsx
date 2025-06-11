import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const annualPieData = [
  { name: "예약", value: 1050 },
  { name: "환불", value: 110 },
  { name: "취소", value: 43 },
];
const COLORS = ["#7b2ff2", "#fe879c", "#e2e2e2"];

const monthlyBarData = [
  { month: "1월", 예약수: 100, 환불수: 11, 취소수: 3 },
  { month: "2월", 예약수: 120, 환불수: 8, 취소수: 4 },
  { month: "3월", 예약수: 180, 환불수: 10, 취소수: 6 },
  { month: "4월", 예약수: 210, 환불수: 13, 취소수: 8 },
  { month: "5월", 예약수: 160, 환불수: 12, 취소수: 9 },
];

const todayStat = [
  { label: "오늘 예약", value: 7, color: "text-purple-700" },
  { label: "오늘 환불", value: 2, color: "text-pink-600" },
  { label: "오늘 취소", value: 1, color: "text-gray-500" },
];

const total = 1050 + 110 + 43;
const refundRate = Math.round((110 / total) * 100);

// 커스텀 Tooltip 컴포넌트 추가!
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-purple-300/90 backdrop-blur-2xl leading-relaxed space-y-1 p-3 rounded-2xl shadow-xl text-black/80">
        <p className="font-bold">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx} style={{ color: item.color }}>
            <span className="font-semibold">{item.name}:</span> {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ label, value, color }) {
  return (
    <div className="
      flex flex-col items-center
      bg-white/20 backdrop-blur-lg
      shadow-xl rounded-4xl p-4 w-32 mb-4
      transition-transform duration-200 hover:scale-105
    ">
      <span className="text-base font-semibold tracking-wide">{label}</span>
      <span className={`text-3xl font-bold mt-2 ${color}`}>{value}</span>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="flex flex-col select-none items-center w-full min-h-screen bg-gradient-to-b from-purple-900 to-purple-800/60 px-4">
      {/* Campia 로고 */}
      <h1 className="text-7xl font-bold text-center text-white/90 mt-18 mb-12" style={{ fontFamily: "GapyeongWave" }}>Campia</h1>
      
      {/* 연간 도넛 + 오늘 카드 (가로로 나란히!) */}
      <div className="flex flex-row justify-center gap-10 w-full max-w-5xl mb-10">
        {/* 도넛 */}
        <div className="donut-chart-wrapper backdrop-blur-lg bg-white/30 shadow-2xl rounded-3xl p-10 flex flex-col items-center w-[500px] h-[500px]">
          <h2 className="text-2xl text-black/80 font-bold mb-2 text-center">전체 예약/환불/취소 (연간 누적)</h2>
          <div className="flex flex-col items-center justify-center flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={annualPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={110}
                  fill="#7b2ff2"
                  paddingAngle={3}
                  label
                  stroke="none"
                >
                  {annualPieData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* 범례 */}
            <div className="flex justify-center gap-8 mb-2">
              {annualPieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span style={{
                    display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: COLORS[idx]
                  }} />
                  <span className="text-base font-bold" style={{ color: COLORS[idx] }}>{entry.name}</span>
                </div>
              ))}
              
            </div>
            <p className="text-base text-white/80 mt-2">
             전체 예약 대비 환불 비율: {refundRate}%
            </p>
          </div>
        </div>
        {/* 오늘 카드 세로 배열 */}
        <div className="flex flex-col justify-center items-center backdrop-blur-lg bg-white/30 shadow-2xl rounded-3xl p-8 w-[260px] h-[500px]">
          <h3 className="text-xl text-black/80 font-bold mb-6 text-center">오늘의 예약/환불/취소</h3>
          <div className="flex flex-col gap-4 text-black/70 justify-center items-center">
            {todayStat.map((stat, i) => (
              <StatCard key={i} label={stat.label} value={stat.value} color={stat.color} />
            ))}
          </div>
        </div>
      </div>

      {/* 월간 막대 그래프 */}
      <div className="backdrop-blur-lg bg-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-[800px] flex flex-col items-center mb-10">
        <h3 className="text-2xl text-black/80 font-bold mb-6 text-center">월간 예약/환불/취소</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyBarData} layout="vertical" barCategoryGap={18}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fill: "#00000099", fontWeight: "bold", fontSize: 16 }} />
            <YAxis dataKey="month" type="category" tick={{ fill: "#00000099", fontWeight: "bold", fontSize: 18 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#c9b9e9', fillOpacity: 0.3 }} />
            <Bar dataKey="예약수" fill="#7b2ff2" radius={[0, 8, 8, 0]} barSize={42} />
            <Bar dataKey="환불수" fill="#fe879c" radius={[0, 8, 8, 0]} barSize={36} />
            <Bar dataKey="취소수" fill="#e2e2e2" radius={[0, 8, 8, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* 버튼 */}
      <button
        className="
          mt-2 mb-10 px-10 py-4 flex justify-center
          bg-purple-900/80 hover:bg-purple-900/90
          text-white cursor-pointer font-semibold rounded-full
          shadow-2xl text-xl transition-all duration-150
          border border-white/20
        "
        onClick={() => (window.location.href = '/admin/reservations')}
      >
        관리자 페이지 이동
      </button>
    </div>
  );
}