import { useEffect, useState } from "react";
import api from "../api/axios";
import UrlForm from "../components/UrlForm";
import UrlCard from "../components/UrlCard";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/urls")
      .then(({ data }) => setUrls(data))
      .catch(() => setError("Could not load your links"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (newUrl) => setUrls((prev) => [newUrl, ...prev]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link?")) return;
    try {
      await api.delete(`/urls/${id}`);
      setUrls((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError("Could not delete the link");
    }
  };

  return (
    <div>
      <section className="bg-soft py-12">
        <div className="max-w-6xl mx-auto px-4">
          <span className="bg-brand text-ink font-black italic uppercase px-3 py-1 text-sm">
            Short links, big results
          </span>
          <h1 className="text-3xl md:text-4xl font-black mt-4 mb-6">
            Shorten any URL in one click
          </h1>
          <UrlForm onCreated={handleCreated} />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-black uppercase mb-4">Your links</h2>

        {error && <p className="text-danger mb-4">{error}</p>}
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : urls.length === 0 ? (
          <p className="text-muted">No links yet. Create your first one above.</p>
        ) : (
          <div className="space-y-3">
            {urls.map((u) => (
              <UrlCard key={u.id} url={u} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}