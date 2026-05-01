import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const completed = tasks.filter((t) => t.status === "Done").length;
  const pending = tasks.length - completed;

  return (
    <div className="app-shell">
      <div className="app-container">
        <div className="mb-8">
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">
            Overview of your tasks and progress
          </p>
        </div>

        {loading ? (
          <p className="text-slate-600">Loading dashboard...</p>
        ) : tasks.length === 0 ? (
          <div className="surface-card p-10 text-center text-slate-600">
            No data yet. Start by adding tasks.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="surface-card min-h-32 p-6 transition hover:-translate-y-0.5">
                <p className="text-sm text-slate-500">Total Tasks</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">{tasks.length}</h3>
              </div>

              <div className="surface-card min-h-32 p-6 transition hover:-translate-y-0.5">
                <p className="text-sm text-slate-500">Completed</p>
                <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                  {completed}
                </h3>
              </div>

              <div className="surface-card min-h-32 p-6 transition hover:-translate-y-0.5">
                <p className="text-sm text-slate-500">Pending</p>
                <h3 className="mt-2 text-3xl font-bold text-amber-600">
                  {pending}
                </h3>
              </div>
            </div>

            <div className="surface-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Tasks</h3>

              <div className="space-y-3">
                {tasks.slice(0, 5).map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm text-slate-700">{t.title}</span>

                    <span
                      className={`badge ${
                        t.status === "Done"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;