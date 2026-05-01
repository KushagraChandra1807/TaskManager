import { useEffect, useState, useContext } from "react";
import { getTasks, createTask } from "../services/taskService";
import { getUsers } from "../services/userService";
import { getProjects } from "../services/projectService";
import { AuthContext } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";

function Tasks() {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [project, setProject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!title.trim() || !assignedTo || !project) return;

    try {
      await createTask({
        title,
        assignedTo,
        project,
        dueDate: dueDate || undefined,
      });
      setTitle("");
      setAssignedTo("");
      setProject("");
      setDueDate("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (user?.role === "Admin") {
      fetchUsers();
      fetchProjects();
    }
  }, [user]);

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "Pending").length,
    done: tasks.filter((t) => t.status === "Done").length,
    due: tasks.filter(
      (t) => t.status !== "Done" && t.dueDate && new Date(t.dueDate) < new Date()
    ).length,
  };

  const filterOptions = [
    { key: "All", count: stats.total },
    { key: "Pending", count: stats.pending },
    { key: "Done", count: stats.done },
  ];

  return (
    <div className="app-shell">
      <div className="app-container">
        <div className="mb-6">
          <h2 className="page-title">Tasks</h2>
          <p className="page-subtitle">
            {user?.role === "Admin"
              ? "Assign tasks to your team"
              : "Tasks assigned to you"}
          </p>
        </div>

        {user?.role === "Admin" && (
          <div className="surface-card mb-6 p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Assign New Task</h3>
                <p className="text-sm text-slate-600">
                  Select project, assignee, and optional due date.
                </p>
              </div>
            </div>

            <div className="mt-2 grid gap-3 md:grid-cols-2 xl:grid-cols-12">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="form-control-ui md:col-span-2 xl:col-span-4"
              />

              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="select-ui xl:col-span-2"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>

              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="select-ui xl:col-span-2"
              >
                <option value="">Assign User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-control-ui xl:col-span-2"
              />

              <button
                onClick={addTask}
                disabled={!title.trim() || !assignedTo || !project}
                className="btn-primary h-11 w-full xl:col-span-2"
              >
                Assign Task
              </button>
            </div>
          </div>
        )}

        <div className="surface-card mb-6 p-4">
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Pending</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Done</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{stats.done}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Due</p>
              <p className="mt-1 text-2xl font-bold text-rose-600">{stats.due}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                filter === f.key
                  ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {f.key}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {f.count}
              </span>
            </button>
          ))}
          </div>
        </div>

        {loading ? (
          <div className="surface-card p-8 text-center text-slate-600">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="surface-card p-8 text-center text-slate-600">
            No tasks found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                refresh={fetchTasks}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;