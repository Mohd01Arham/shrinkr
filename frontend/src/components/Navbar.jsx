import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md border-t-4 border-ink">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-ink text-brand font-black italic px-2 py-1 text-xl leading-none">
            S
          </span>
          <span className="font-black text-xl tracking-tight uppercase">Shrinkr</span>
        </Link>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/" className="font-medium uppercase text-sm hover:text-brand-dark">
                Dashboard
              </Link>
              <span className="hidden sm:block text-sm text-muted">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-brand hover:bg-brand-dark text-ink font-medium px-5 py-2 rounded cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-brand hover:bg-brand-dark text-ink font-medium px-5 py-2 rounded"
            >
              Login/Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}