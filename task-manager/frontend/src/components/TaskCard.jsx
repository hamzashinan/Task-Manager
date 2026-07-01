import React from "react";
import { Calendar, Trash2, Edit3, CheckCircle, Clock, AlertCircle, ArrowRight, ArrowLeft, Tag } from "lucide-react";

function TaskCard({
  task,
  onDelete,
  onEdit,
  onComplete,
  onStatusChange, // callback to move task between boards: (id, newStatus)
}) {
  if (!task) return null;

  // Determine if task is overdue
  const isOverdue = (() => {
    if (!task.due_date || task.status === "COMPLETED") return false;
    // Parse due_date at end of day
    const dueDateObj = new Date(task.due_date + "T23:59:59");
    const today = new Date();
    return dueDateObj < today;
  })();

  // Formatting due date
  const formattedDate = (() => {
    if (!task.due_date) return "No due date";
    const dateObj = new Date(task.due_date + "T00:00:00");
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  })();

  // Extract tags list
  const tagsList = task.tags
    ? task.tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
    : [];

  // Priority Visual Presets
  const priorityConfig = {
    HIGH: {
      border: "border-l-4 border-l-rose-500",
      badge: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      text: "High",
    },
    MEDIUM: {
      border: "border-l-4 border-l-amber-500",
      badge: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      text: "Medium",
    },
    LOW: {
      border: "border-l-4 border-l-teal-500",
      badge: "bg-teal-500/10 border-teal-500/20 text-teal-400",
      text: "Low",
    },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  // Status visual presets
  const statusConfig = {
    TODO: {
      badge: "bg-slate-800 border-slate-700 text-slate-400",
      text: "To Do",
    },
    IN_PROGRESS: {
      badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 animate-pulse-subtle",
      text: "In Progress",
    },
    COMPLETED: {
      badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      text: "Completed",
    },
  };

  const status = statusConfig[task.status] || statusConfig.TODO;

  return (
    <div className={`p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/60 backdrop-blur-md transition-all duration-300 shadow-md ${priority.border} flex flex-col justify-between gap-4 group font-sans`}>
      {/* Top Details */}
      <div className="space-y-3">
        {/* Badges Bar */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priority.badge} uppercase tracking-wider`}>
              {priority.text}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.badge} uppercase tracking-wider`}>
              {status.text}
            </span>
          </div>
          
          {/* Quick Actions in Header */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Edit Task"
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              title="Delete Task"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Task Title & Description */}
        <div className="space-y-1.5 text-left">
          {/* Project badge */}
          {task.project && (
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: task.project.color }}></span>
              <span className="text-xs font-medium text-slate-300">{task.project.name}</span>
            </div>
          )}
          <h3 className={`text-base font-bold text-white tracking-tight ${task.status === "COMPLETED" ? "line-through text-slate-500" : ""}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-xs text-slate-400 leading-relaxed line-clamp-2 ${task.status === "COMPLETED" ? "text-slate-600" : ""}`}>
              {task.description}
            </p>
          )}
        </div>

        {/* Tags List */}
        {tagsList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-800/40 text-left">
            {tagsList.map((tg, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800/60 border border-slate-850 px-2 py-0.5 rounded-md"
              >
                <Tag size={8} /> {tg}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer info & Board operations */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-800/40">
        {/* Due Date */}
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${isOverdue ? "text-rose-400" : "text-slate-400"}`}>
          {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
          <span>{formattedDate}</span>
          {isOverdue && (
            <span className="text-[9px] uppercase font-extrabold bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20 tracking-wider">
              Overdue
            </span>
          )}
        </div>

        {/* Board column transfer arrows or complete checkbox */}
        <div className="flex items-center gap-1.5">
          {task.status !== "COMPLETED" && (
            <button
              onClick={() => onComplete(task.id)}
              className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 cursor-pointer shadow-sm transition-all"
            >
              <CheckCircle size={12} />
              <span>Complete</span>
            </button>
          )}

          {/* Quick Kanban board updates */}
          {onStatusChange && (
            <div className="flex items-center gap-1 border-l border-slate-800/80 pl-1.5">
              {task.status === "IN_PROGRESS" && (
                <button
                  onClick={() => onStatusChange(task.id, "TODO")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  title="Move back to Todo"
                >
                  <ArrowLeft size={13} />
                </button>
              )}
              {task.status === "TODO" && (
                <button
                  onClick={() => onStatusChange(task.id, "IN_PROGRESS")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  title="Move to In Progress"
                >
                  <ArrowRight size={13} />
                </button>
              )}
              {task.status === "IN_PROGRESS" && (
                <button
                  onClick={() => onStatusChange(task.id, "COMPLETED")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                  title="Move to Completed"
                >
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;