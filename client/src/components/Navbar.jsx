import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-cyan-50 text-cyan-700 border-cyan-200"
      : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:flex-nowrap md:px-6">
        <h1 className="text-xl font-bold tracking-wide text-slate-900">
          Task<span className="text-cyan-700">Manager</span>
        </h1>

        <nav className="order-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 md:order-2 md:w-auto">
          <Link
            to="/dashboard"
            className={`${isActive("/dashboard")} rounded-lg border px-3 py-1.5 text-xs font-medium transition md:text-sm`}
          >
            Dashboard
          </Link>
          <Link
            to="/projects"
            className={`${isActive("/projects")} rounded-lg border px-3 py-1.5 text-xs font-medium transition md:text-sm`}
          >
            Projects
          </Link>
          <Link
            to="/tasks"
            className={`${isActive("/tasks")} rounded-lg border px-3 py-1.5 text-xs font-medium transition md:text-sm`}
          >
            Tasks
          </Link>
        </nav>

        <div className="order-2 flex items-center gap-3 md:order-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-sm font-bold text-cyan-700">
            U
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              nav("/");
            }}
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;