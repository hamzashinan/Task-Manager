import { LayoutDashboard, CheckSquare, LogOut, CheckCircle2, User } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Sidebar({ activeTab = "dashboard", setActiveTab }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "board", label: "Kanban Board", icon: CheckSquare },
  ];

  return (
    <aside className="w-64 bg-[#0c1222] border-r border-slate-800/60 h-screen flex flex-col justify-between p-5 font-sans relative z-20">
      {/* Top Section */}
      <div className="space-y-8">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <CheckCircle2 size={22} className="stroke-[2.5]" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            TaskFlow Pro
          </span>
        </div>

        {/* Navigation Link list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 w-full rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon size={18} className={isActive ? "stroke-[2.5]" : ""} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section - User Profile */}
      <div className="space-y-4 pt-4 border-t border-slate-800/60">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-slate-200 truncate leading-tight">
                {user.username}
              </p>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {user.email || `${user.username}@taskflow.com`}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;