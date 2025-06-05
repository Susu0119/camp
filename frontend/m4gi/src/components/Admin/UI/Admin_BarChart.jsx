import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const stats = [
  { month: "1월", 예약수: 10, 환불수: 1 },
  { month: "2월", 예약수: 20, 환불수: 2 },
  { month: "3월", 예약수: 14, 환불수: 0 },
  { month: "4월", 예약수: 17, 환불수: 3 },
  { month: "5월", 예약수: 30, 환불수: 4 },
];

export function ReservationHorizontalBar() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">월별 예약/환불 (가로막대)</h2>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={stats}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="month" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="예약수" fill="#7b2ff2" radius={[0, 8, 8, 0]} barSize={18}/>
          <Bar dataKey="환불수" fill="#fe879c" radius={[0, 8, 8, 0]} barSize={18}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}