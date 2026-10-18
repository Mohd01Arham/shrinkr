import { useState } from "react";
import { Link } from "react-router-dom";

export default function UrlCard({ url, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white border border-line rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 min-w-0">
        <a
          href={url.shortUrl}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-lg hover:underline"
        >
          {url.shortUrl}
        </a>
        <p className="text-muted text-sm truncate">{url.originalUrl}</p>
      </div>

      <div className="bg-soft rounded px-4 py-2 text-center">
        <p className="text-2xl font-black leading-none">{url.clicks}</p>
        <p className="text-xs text-muted uppercase">Clicks</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="bg-brand hover:bg-brand-dark text-ink font-medium px-4 py-2 rounded text-sm cursor-pointer"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <Link
          to={`/analytics/${url.id}`}
          className="bg-ink text-white font-medium px-4 py-2 rounded text-sm hover:bg-black/80"
        >
          Analytics
        </Link>
        <button
          onClick={() => onDelete(url.id)}
          className="border border-line text-danger font-medium px-4 py-2 rounded text-sm hover:bg-soft cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}