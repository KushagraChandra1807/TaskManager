import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await loginUser(form);
      login(res.data);
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell grid min-h-screen md:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-slate-200 bg-gradient-to-br from-cyan-50 to-white md:flex md:flex-col md:justify-center md:px-14">
        <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
        <h1 className="relative text-4xl font-bold text-slate-900">
          Task<span className="text-cyan-700">Manager</span>
        </h1>
        <p className="relative mt-4 max-w-md text-slate-600">
          Manage projects, assign work, and track delivery with a clean,
          enterprise-ready workflow.
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-10 md:px-8">
        <div className="surface-card w-full max-w-md p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            Welcome back
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Login</h2>

          {error && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <input
              className="input-ui"
              placeholder="Email address"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              className="input-ui"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button onClick={handleSubmit} disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? "Logging in..." : "Login to account"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-cyan-700 hover:text-cyan-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;