import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// --- Heroicons (for menu and close icons) ---
const MenuIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
// --- End Heroicons ---

function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const profileMenuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };


  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
  ];

  return (
    <nav className="bg-slate-900/80 sticky top-0 z-40 w-full border-b border-slate-700/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white">
              LMS<span className="text-blue-500">.</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-800 text-white"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Auth buttons (Desktop) */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="relative ml-3" ref={profileMenuRef}>
                <div>
                  <button type="button" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex max-w-xs items-center rounded-full bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800">
                    <span className="sr-only">Open user menu</span>
                    <img className="h-8 w-8 rounded-full object-cover" src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=0284c7&color=fff`} alt="" />
                  </button>
                </div>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 text-xs text-slate-400">Signed in as</div>
                    <div className="px-4 pb-2 text-sm font-semibold text-white border-b border-slate-700">{user?.name}</div>
                    <div className="py-1">
                      <NavLink to="/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50" onClick={() => setIsProfileMenuOpen(false)}>Dashboard</NavLink>
                      <NavLink to="/my-courses" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50" onClick={() => setIsProfileMenuOpen(false)}>My Courses</NavLink>
                      <NavLink to="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50" onClick={() => setIsProfileMenuOpen(false)}>My Profile</NavLink>
                    </div>
                    {(user?.role === 'instructor' || user?.role === 'admin') && (
                      <div className="py-1 border-t border-slate-700">
                        <NavLink to="/instructor/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50" onClick={() => setIsProfileMenuOpen(false)}>Instructor</NavLink>
                      </div>
                    )}
                    {user?.role === 'admin' && (
                      <div className="py-1 border-t border-slate-700">
                        <NavLink to="/admin/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50" onClick={() => setIsProfileMenuOpen(false)}>Admin</NavLink>
                      </div>
                    )}
                    <div className="py-1 border-t border-slate-700">
                      <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50">Log Out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-4 flex items-center md:ml-6">
                <Link to="/login" className="mr-2 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white">Log In</Link>
                <Link to="/register" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <CloseIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-700 md:hidden">
          <div className="space-y-1 px-2 py-3 sm:px-3">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={({ isActive }) => `block rounded-md px-3 py-2 text-base font-medium ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`} onClick={() => setIsMobileMenuOpen(false)}>{link.name}</NavLink>
            ))}
          </div>
          <div className="border-t border-slate-700 px-2 py-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                {user?.role === 'instructor' && (
                  <Link to="/instructor/dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Instructor Dashboard</Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                )}
                <Link to="/my-courses" className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>My Courses</Link>
                <Link to="/profile" className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                <button onClick={handleLogout} className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white">Log Out</button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                <Link to="/register" className="block rounded-md bg-blue-600 px-3 py-2 text-base font-medium text-white hover:bg-blue-700" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;