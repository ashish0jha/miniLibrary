import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 font-bold text-slate-900">
        <span className="text-xl">📚</span> MiniLibrary
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium">
          Books
        </Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="text-slate-600 hover:text-indigo-600 font-medium">
            Admin
          </Link>
        )}
        <span className="text-slate-300">|</span>
        <span className="text-slate-500">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg transition"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}