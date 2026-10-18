import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/urls/${id}/analytics`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load analytics"));
  }, [id]);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-danger">{error}</p>
        <Link to="/" className="underline font-medium">Back to dashboard</Link>
      </div>
    );
  }

  if (!data) {
    return <p className="max-w-6xl mx-auto px-4 py-10 text-muted">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/" className="text-sm font-medium underline">← Back</Link>

      <h1 className="text-3xl font-black mt-3">/{data.shortCode}</h1>
      <p className="text-muted truncate mb-6">{data.originalUrl}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-brand rounded-lg p-5">
          <p className="text-sm font-medium uppercase">Total clicks</p>
          <p className="text-4xl font-black">{data.totalClicks}</p>
        </div>
        <div className="bg-soft rounded-lg p-5">
          <p className="text-sm text-muted uppercase">Last 7 days</p>
          <p className="text-4xl font-black">
            {data.clicksPerDay.reduce((sum, d) => sum + d.count, 0)}
          </p>
        </div>
        <div className="bg-soft rounded-lg p-5">
          <p className="text-sm text-muted uppercase">Top source</p>
          <p className="text-xl font-black truncate">
            {data.topReferrers[0]?.referrer || "No data yet"}
          </p>
        </div>
      </div>

      <div className="bg-white border border-line rounded-lg p-5 mb-6">
        <h2 className="font-black uppercase mb-4">Clicks per day</h2>
        {data.clicksPerDay.length === 0 ? (
          <p className="text-muted">No clicks in the last 7 days.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.clicksPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#6B7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#FFC20E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-white border border-line rounded-lg p-5">
        <h2 className="font-black uppercase mb-4">Top referrers</h2>
        {data.topReferrers.length === 0 ? (
          <p className="text-muted">No data yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {data.topReferrers.map((r) => (
              <li key={r.referrer} className="flex justify-between py-2">
                <span className="truncate pr-4">{r.referrer}</span>
                <span className="font-bold">{r.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}