import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const pieData = [
  { name: "예약", value: 91 },
  { name: "환불", value: 10 },
  { name: "취소", value: 5 },
];
// 브랜드 보라 계열 컬러!
const COLORS = ["#7b2ff2", "#fe879c", "#e2e2e2"];

export function ReservationDonutChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">예약/환불/취소 도넛 차트</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#7b2ff2"
            paddingAngle={3}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}