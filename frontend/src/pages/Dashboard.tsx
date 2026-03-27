import { useEffect, useState } from "react";
import { getOverview, getReliability } from "../services/api";

export default function Dashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [reliability, setReliability] = useState<any>(null);

  useEffect(() => {
    getOverview().then(res => setOverview(res.data));
    getReliability().then(res => setReliability(res.data));
  }, []);

  return (
    <div>
      <h1>NeuralWatch Dashboard</h1>

      {overview && (
        <div>
          <p>Total Requests: {overview.total_requests}</p>
          <p>Success Rate: {overview.success_rate}</p>
          <p>Avg Latency: {overview.avg_latency}</p>
          <p>Total Cost: {overview.total_cost}</p>
        </div>
      )}

      {reliability && (
        <div>
          <p>Reliability Score: {reliability.reliability_score}</p>
        </div>
      )}
    </div>
  );
}