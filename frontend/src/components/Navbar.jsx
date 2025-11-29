// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-20 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-sm font-semibold text-white">
          LMS <span className="text-xs text-emerald-400">MERN</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-3 text-xs">
          <Link
            to="/courses"
            className="text-slate-300 hover:text-white transition"
          >
            Courses
          </Link>

          {/* Admin Dashboard Link */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-slate-300 hover:text-white transition"
            >
              Admin
            </Link>
          )}

          {/* Authenticated User */}
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-300 hover:text-white transition"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-[11px] text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-[11px] text-white transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
