type Props = {
  title: string;
  value: string | number;
};

export default function Card({ title, value }: Props) {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-md">
      <h3 className="text-sm text-gray-400">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
