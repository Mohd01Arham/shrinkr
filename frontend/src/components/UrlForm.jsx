import { useState } from "react";
import api from "../api/axios";

export default function UrlForm({ onCreated }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/urls", { originalUrl });
      onCreated({ ...data, clicks: 0, createdAt: new Date().toISOString() });
      setOriginalUrl("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Paste a long URL, e.g. https://github.com/..."
          className="flex-1 bg-field rounded px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand hover:bg-brand-dark disabled:opacity-60 text-ink font-bold uppercase px-8 py-3 rounded cursor-pointer"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>
      {error && <p className="text-danger text-sm mt-2">{error}</p>}
    </form>
  );
}