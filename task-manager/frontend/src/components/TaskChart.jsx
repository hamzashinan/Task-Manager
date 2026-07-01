import React from "react";
import { Award, TrendingUp, CheckCircle2 } from "lucide-react";

function TaskChart({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const pending = total - completed;

  const lowCount = tasks.filter((t) => t.priority === "LOW").length;
  const medCount = tasks.filter((t) => t.priority === "MEDIUM").length;
  const highCount = tasks.filter((t) => t.priority === "HIGH").length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG Ring Settings
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  // Priority bar max height factor
  const maxPriority = Math.max(lowCount, medCount, highCount, 1);
  const getBarHeight = (count) => {
    return (count / maxPriority) * 80; // max height of 80px
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
      {/* Chart Card 1: Completion Gauge */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-950/40 border border-slate-800/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <TrendingUp size={12} /> Analytics Overview
          </div>
          <h3 className="text-lg font-bold text-white">Task Completion</h3>
          <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
            You've completed <span className="text-emerald-400 font-bold">{completed}</span> out of <span className="text-indigo-400 font-bold">{total}</span> total tasks assigned. Keep going!
          </p>
          <div className="flex gap-4 pt-1 justify-center sm:justify-start">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Done</p>
              <p className="text-sm font-bold text-emerald-400">{completed}</p>
            </div>
            <div className="border-l border-slate-800 h-8"></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Pending</p>
              <p className="text-sm font-bold text-amber-400">{pending}</p>
            </div>
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Active ring */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-emerald-500 transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute text-center space-y-0.5">
            <p className="text-2xl font-extrabold text-white">{completionRate}%</p>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Rate</p>
          </div>
        </div>
      </div>

      {/* Chart Card 2: Priority Stats */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-950/40 border border-slate-800/60 backdrop-blur-md flex flex-col justify-between gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
            Priority Distribution
          </h3>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/10">
            Total {total}
          </span>
        </div>

        {/* Priority Bar Chart */}
        <div className="flex items-end justify-around h-24 pt-4 border-b border-slate-800/60 px-2">
          {/* Low Priority Bar */}
          <div className="flex flex-col items-center gap-1 flex-1 group">
            <div className="text-[10px] font-bold text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1">
              {lowCount}
            </div>
            <div
              style={{ height: `${getBarHeight(lowCount)}px` }}
              className="w-8 rounded-t-lg bg-teal-500/20 hover:bg-teal-500/40 border-t-2 border-teal-400 transition-all duration-500 ease-out"
            ></div>
            <span className="text-[10px] font-semibold text-slate-500 mt-1">Low</span>
          </div>

          {/* Medium Priority Bar */}
          <div className="flex flex-col items-center gap-1 flex-1 group">
            <div className="text-[10px] font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1">
              {medCount}
            </div>
            <div
              style={{ height: `${getBarHeight(medCount)}px` }}
              className="w-8 rounded-t-lg bg-amber-500/20 hover:bg-amber-500/40 border-t-2 border-amber-400 transition-all duration-500 ease-out"
            ></div>
            <span className="text-[10px] font-semibold text-slate-500 mt-1">Med</span>
          </div>

          {/* High Priority Bar */}
          <div className="flex flex-col items-center gap-1 flex-1 group">
            <div className="text-[10px] font-bold text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1">
              {highCount}
            </div>
            <div
              style={{ height: `${getBarHeight(highCount)}px` }}
              className="w-8 rounded-t-lg bg-rose-500/20 hover:bg-rose-500/40 border-t-2 border-rose-400 transition-all duration-500 ease-out"
            ></div>
            <span className="text-[10px] font-semibold text-slate-500 mt-1">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskChart;
