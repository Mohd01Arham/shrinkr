import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-soft min-h-[calc(100vh-68px)] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <span className="bg-brand text-ink font-black italic uppercase px-3 py-1 text-sm">
          Join now
        </span>
        <h1 className="text-3xl font-black mt-4 mb-6">Create account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-field rounded px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-field rounded px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-field rounded px-4 py-3 outline-none focus:ring-2 focus:ring-brand"
            required
            minLength={6}
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-ink font-bold uppercase py-3 rounded cursor-pointer"
          >
            {loading ? "Please wait..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-muted mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-ink font-bold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}