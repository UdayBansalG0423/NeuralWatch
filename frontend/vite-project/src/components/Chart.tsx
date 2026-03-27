import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartPoint = {
  name: string;
  value: number;
};

type Props = {
  data: ChartPoint[];
};

export default function Chart({ data }: Props) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#60a5fa" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
