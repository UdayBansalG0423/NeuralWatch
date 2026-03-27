type Props = {
  title: string;
  value: string | number;
};

export default function Card({ title, value }: Props) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg hover:scale-105 transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-semibold mt-2">{value}</h2>
    </div>
  );
}
