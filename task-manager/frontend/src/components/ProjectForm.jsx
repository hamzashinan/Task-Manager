import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, AlertCircle } from "lucide-react";

function ProjectForm({
  isOpen = false,
  onClose,
  onProjectSaved,
  project = null,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#6366F1",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || "",
        description: project.description || "",
        color: project.color || "#6366F1",
      });
    } else {
      setForm({
        name: "",
        description: "",
        color: "#6366F1",
      });
    }

    setError("");
  }, [project, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!form.name.trim()) {
      setError("Project name is required.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;

      if (project) {
        response = await api.put(`projects/${project.id}/`, form);
      } else {
        response = await api.post("projects/", form);
      }

      if (onProjectSaved) {
        onProjectSaved(response.data);
      }

      onClose();
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.detail ||
        err.response?.data?.name?.[0] ||
        "Registration failed. Please fill out the form correctly.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-[#0b101f] border-l border-slate-800 shadow-2xl h-full flex flex-col overflow-y-auto animate-slide-in-right">

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {project ? "Edit Project" : "Create New Project"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs uppercase text-slate-400 font-bold">
              Project Name
            </label>

            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase text-slate-400 font-bold">
              Description
            </label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white resize-none focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase text-slate-400 font-bold">
              Color
            </label>

            <div className="mt-2 flex items-center gap-4">
              <input
                type="color"
                value={form.color}
                onChange={(e) =>
                  setForm({
                    ...form,
                    color: e.target.value,
                  })
                }
                className="w-12 h-12 rounded border border-slate-700 cursor-pointer"
              />

              <span className="text-slate-400 text-sm">
                {form.color}
              </span>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex gap-3">

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : project ? (
              "Save Changes"
            ) : (
              "Create Project"
            )}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProjectForm;
