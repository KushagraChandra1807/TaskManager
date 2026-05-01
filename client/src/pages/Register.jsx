import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.email || !form.password) {
        setError("All fields are required");
        return;
      }

      setLoading(true);
      setError("");

      await registerUser(form);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell grid min-h-screen md:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-slate-200 bg-gradient-to-br from-cyan-50 to-white md:flex md:flex-col md:justify-center md:px-14">
        <div className="pointer-events-none absolute -left-20 bottom-12 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
        <h1 className="relative text-4xl font-bold text-slate-900">
          Task<span className="text-cyan-700">Manager</span>
        </h1>
        <p className="relative mt-4 max-w-md text-slate-600">
          Create an account and set up your team workspace in minutes.
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-10 md:px-8">
        <div className="surface-card w-full max-w-md p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            Get started
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Create account</h2>

          {error && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <input
              className="input-ui"
              placeholder="Full name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
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
            <select
              className="select-ui"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/" className="font-medium text-cyan-700 hover:text-cyan-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;