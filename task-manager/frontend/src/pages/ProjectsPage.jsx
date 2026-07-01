import { useEffect, useState } from "react";
import api from "../api/axios";
import ProjectForm from "../components/ProjectForm";
import { Pencil, Trash2 } from "lucide-react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await api.get("projects/");
      setProjects(response.data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectSaved = (project) => {
    if (selectedProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? project : p))
      );
    } else {
      setProjects((prev) => [project, ...prev]);
    }

    setSelectedProject(null);
  };

  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`projects/${projectId}/`);

      setProjects((prev) =>
        prev.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Unable to delete project.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Projects</h1>

        <button
          onClick={() => {
            setSelectedProject(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold shadow-lg"
        >
          Add Project
        </button>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
          <h2 className="text-xl text-slate-300 font-semibold">
            No Projects Yet
          </h2>

          <p className="text-slate-500 mt-2">
            Create your first project to organize tasks.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => {
            const progress =
              project.total_tasks === 0
                ? 0
                : Math.round(
                    (project.completed_tasks / project.total_tasks) * 100
                  );

            return (
              <div
                key={project.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 hover:border-indigo-500 transition"
              >
                {/* Color */}
                <div
                  className="w-4 h-4 rounded-full mb-4"
                  style={{ backgroundColor: project.color }}
                />

                {/* Name */}
                <h2 className="text-xl font-bold text-white">
                  {project.name}
                </h2>

                {/* Description */}
                <p className="text-slate-400 mt-2">
                  {project.description || "No description"}
                </p>

                {/* Statistics */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Total Tasks</span>
                    <span>{project.total_tasks}</span>
                  </div>

                  <div className="flex justify-between text-sm text-green-400">
                    <span>Completed</span>
                    <span>{project.completed_tasks}</span>
                  </div>

                  <div className="flex justify-between text-sm text-yellow-400">
                    <span>Pending</span>
                    <span>{project.pending_tasks}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setIsFormOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Form */}
      <ProjectForm
        isOpen={isFormOpen}
        project={selectedProject}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProject(null);
        }}
        onProjectSaved={handleProjectSaved}
      />
    </div>
  );
}

export default Projects;