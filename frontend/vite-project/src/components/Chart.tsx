import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Chart({ data, title }: any) {
  return (
    <div className="bg-[#111827] p-4 rounded-2xl border border-gray-800">
      <h3 className="mb-4 text-gray-400">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#22c55e" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
