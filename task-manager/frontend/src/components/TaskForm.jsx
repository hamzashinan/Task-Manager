import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Tag, Calendar, AlertCircle } from "lucide-react";

function TaskForm({
  isOpen = false,
  onClose,
  onTaskCreated,
  editingTask,
  setEditingTask,
  fetchTasks,
}) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    due_date: "",
    tags: "",
    project: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync editing task content
  // Fetch projects for dropdown
  useEffect(() => {
    if (isOpen) {
      api
        .get("projects/")
        .then((res) => setProjects(res.data))
        .catch((err) => console.error("Error loading projects:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        priority: editingTask.priority || "MEDIUM",
        status: editingTask.status || "TODO",
        due_date: editingTask.due_date || "",
        tags: editingTask.tags || "",
        project: editingTask.project || null,
      });
    } else {
      // Reset form if not editing
      setForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        due_date: "",
        tags: "",
        project: null,
      });
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (editingTask) {
        // Edit Task
        const response = await api.patch(`tasks/${editingTask.id}/`, form);
        if (fetchTasks) fetchTasks();
        if (setEditingTask) setEditingTask(null);
      } else {
        // Create Task
        const response = await api.post("tasks/", form);
        if (onTaskCreated) onTaskCreated(response.data);
        if (fetchTasks) fetchTasks();
      }
      
      // Reset and Close
      setForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      due_date: "",
      tags: "",
      project: null,
    });
      if (onClose) onClose();
    } catch (err) {
      console.error("Task submission error:", err.response?.data || err.message);
      setError("Failed to save task. Please verify all inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => {
          if (setEditingTask) setEditingTask(null);
          if (onClose) onClose();
        }}
      />

      {/* Slide-over Content Drawer */}
      <div className="relative w-full max-w-lg bg-[#0b101f] border-l border-slate-800/80 shadow-2xl h-full flex flex-col justify-between overflow-y-auto animate-slide-in-right z-50">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={() => {
              if (setEditingTask) setEditingTask(null);
              if (onClose) onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Design user landing page"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200 placeholder:text-slate-650 text-sm font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description
            </label>
            <textarea
              placeholder="Add details about this task..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200 placeholder:text-slate-650 text-sm font-medium resize-none"
            />
          </div>

          {/* Priority Grid Selector */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "LOW", label: "Low", color: "border-teal-500/25 bg-teal-500/5 text-teal-400", activeColor: "border-teal-500 bg-teal-500/20 text-teal-300" },
                { id: "MEDIUM", label: "Medium", color: "border-amber-500/25 bg-amber-500/5 text-amber-400", activeColor: "border-amber-500 bg-amber-500/20 text-amber-300" },
                { id: "HIGH", label: "High", color: "border-rose-500/25 bg-rose-500/5 text-rose-400", activeColor: "border-rose-500 bg-rose-500/20 text-rose-300" },
              ].map((prio) => {
                const active = form.priority === prio.id;
                return (
                  <button
                    key={prio.id}
                    type="button"
                    onClick={() => setForm({ ...form, priority: prio.id })}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                      active ? prio.activeColor : `${prio.color} hover:bg-slate-800/40`
                    }`}
                  >
                    {prio.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "TODO", label: "To Do", activeColor: "border-slate-600 bg-slate-800 text-slate-200" },
                { id: "IN_PROGRESS", label: "In Progress", activeColor: "border-indigo-500 bg-indigo-500/10 text-indigo-400" },
                { id: "COMPLETED", label: "Completed", activeColor: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
              ].map((stat) => {
                const active = form.status === stat.id;
                return (
                  <button
                    key={stat.id}
                    type="button"
                    onClick={() => setForm({ ...form, status: stat.id })}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                      active
                        ? stat.activeColor
                        : "border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                    }`}
                  >
                    {stat.label}
                  </button>
                );
              })}
            </div>
          </div>
                       
                 {/* Project */}
<div className="space-y-1.5 text-left">
  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
    Project
  </label>

  <select
    value={form.project || ""}
    onChange={(e) =>
      setForm({
        ...form,
        project: e.target.value ? Number(e.target.value) : null,
      })
    }
    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200 text-sm font-medium"
  >
    <option value="">No Project</option>

    {projects.map((project) => (
      <option key={project.id} value={project.id}>
        {project.name}
      </option>
    ))}
  </select>
</div>

          {/* Due Date & Tags Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar size={13} /> Due Date
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200 text-sm font-medium"
              />
            </div>

            {/* Tags (comma separated) */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag size={13} /> Tags (comma-separated)
              </label>

              <input
                type="text"
                placeholder="e.g. Design, Frontend"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200 placeholder:text-slate-650 text-sm font-medium"
              />
            </div>
          </div>
        </form>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-slate-800/60 flex items-center gap-3 bg-slate-950/20">
          <button
            type="button"
            onClick={() => {
              if (setEditingTask) setEditingTask(null);
              if (onClose) onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 text-sm font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-grow py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : editingTask ? (
              "Save Changes"
            ) : (
              "Create Task"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;