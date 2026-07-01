import React from "react";
import { FolderKanban, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

function StatsCard({ title, value, type = "total" }) {
  // Config matching stats types
  const config = {
    total: {
      color: "from-blue-600/10 to-indigo-600/5",
      borderColor: "border-blue-500/20 hover:border-blue-500/40",
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      icon: FolderKanban,
      subtext: "Total assigned tasks",
    },
    completed: {
      color: "from-emerald-600/10 to-teal-600/5",
      borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      icon: CheckCircle2,
      subtext: "Completed tasks",
    },
    pending: {
      color: "from-amber-600/10 to-orange-600/5",
      borderColor: "border-amber-500/20 hover:border-amber-500/40",
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      icon: Clock,
      subtext: "In progress or to do",
    },
    overdue: {
      color: "from-rose-600/10 to-red-600/5",
      borderColor: "border-rose-500/20 hover:border-rose-500/40",
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      icon: AlertTriangle,
      subtext: "Past due and incomplete",
    },
  };

  const current = config[type] || config.total;
  const Icon = current.icon;

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${current.color} backdrop-blur-md border ${current.borderColor} shadow-lg shadow-slate-950/20 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-between gap-4 font-sans`}>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
          {title}
        </p>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          {current.subtext}
        </p>
      </div>
      <div className={`p-3.5 rounded-xl border ${current.iconColor} flex items-center justify-center shrink-0 shadow-md`}>
        <Icon size={24} className="stroke-[2]" />
      </div>
    </div>
  );
}

export default StatsCard;