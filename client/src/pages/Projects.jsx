import { useContext, useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  getProjectsProgress,
  getProjectTaskSummary,
} from "../services/projectService";
import { AuthContext } from "../context/AuthContext";

function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [progressByProject, setProgressByProject] = useState({});

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);

      if (user?.role === "Admin") {
        const progressRes = await getProjectsProgress();
        setProgressByProject(progressRes.data);
      } else {
        setProgressByProject({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async () => {
    if (!title.trim()) return;

    await createProject({ title });
    setTitle("");
    fetchProjects();
  };

  const handleProjectClick = async (projectId) => {
    if (user?.role !== "Admin") return;

    setSelectedProjectId(projectId);
    setSummaryError("");
    setSummaryLoading(true);
    try {
      const res = await getProjectTaskSummary(projectId);
      setSummary(res.data);
    } catch (err) {
      setSummary(null);
      setSummaryError(err.response?.data?.msg || "Unable to load project summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  return (
    <div className="app-shell">
      <div className="app-container">
        <div className="mb-8">
          <h2 className="page-title">Projects</h2>
          <p className="page-subtitle">
            Organize and manage your projects efficiently
          </p>
        </div>

        {user?.role === "Admin" && (
          <div className="surface-card mb-8 p-6">
            <label className="mb-2 block text-sm text-slate-600">
              Project Name
            </label>

            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addProject()}
                placeholder="Enter project title..."
                className="input-ui flex-1"
              />

              <button
                onClick={addProject}
                disabled={!title.trim()}
                className="btn-primary w-full md:w-auto"
              >
                Add Project
              </button>
            </div>
          </div>
        )}

        {user?.role === "Admin" && (
          <div className="surface-card mb-8 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Project Task Summary</h3>
            <p className="mt-1 text-sm text-slate-600">
              Click any project card below to view task counts for that project.
            </p>

            {summaryLoading ? (
              <p className="mt-5 text-slate-600">Loading summary...</p>
            ) : summaryError ? (
              <p className="mt-5 text-sm text-rose-700">{summaryError}</p>
            ) : summary ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Project</p>
                  <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                    {summary.projectTitle}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Remaining</p>
                  <p className="mt-2 text-2xl font-bold text-amber-600">{summary.remaining}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Done</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">{summary.done}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Due</p>
                  <p className="mt-2 text-2xl font-bold text-rose-600">{summary.due}</p>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-slate-600">
                Select a project to see remaining, done, and due task counts.
              </p>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-slate-600">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="surface-card mt-8 p-10 text-center text-slate-600">
            <p className="text-lg">No projects yet</p>
            <p className="mt-1 text-sm">Create your first project to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => {
              const progress = progressByProject[p._id] || {
                total: 0,
                done: 0,
                pending: 0,
                percentage: 0,
              };

              return (
                <div
                  key={p._id}
                  onClick={() => handleProjectClick(p._id)}
                  className={`surface-card flex min-h-44 flex-col p-5 transition hover:-translate-y-0.5 ${
                    user?.role === "Admin" ? "cursor-pointer hover:border-cyan-300" : ""
                  } ${selectedProjectId === p._id ? "border-cyan-400" : ""}`}
                >
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{p.title}</h3>
                  <p className="text-sm text-slate-600">
                    Manage tasks and collaborate with your team
                  </p>

                  {user?.role === "Admin" && (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
                        <span>Progress</span>
                        <span className="font-semibold text-cyan-700">{progress.percentage}%</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2.5 rounded-full bg-cyan-600 transition-all"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-600">
                        Done {progress.done} | Pending {progress.pending}
                      </p>
                    </div>
                  )}

                  <div className="mt-auto pt-4 text-xs text-slate-500">
                    ID: {p._id.slice(-6)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;