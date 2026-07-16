import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FileText, LogOut, CreditCard, LayoutDashboard, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
              <FileText className="h-6 w-6 text-brand-500" />
              <span>Resume<span className="text-gradient">AI</span></span>
            </Link>
            
            {user && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "bg-white/5 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/billing"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/billing")
                      ? "bg-white/5 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Billing
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                    user.plan === "pro"
                      ? "bg-accent-500/10 text-accent-600 border border-accent-500/20"
                      : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                  }`}
                >
                  {user.plan} Plan
                </span>
                
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-medium text-white">{user.full_name || "Developer"}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                    title="Log Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
