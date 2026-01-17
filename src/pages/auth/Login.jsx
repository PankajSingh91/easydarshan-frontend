import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import { saveToken } from "../../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!form.email || !form.password) return alert("Enter email and password");

      setLoading(true);
      const res = await api.post("/api/auth/login", form);

      saveToken(res.data.token);
      alert("✅ Login successful");

      navigate("/pilgrim");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-3xl shadow-soft p-7">
        <h2 className="text-2xl font-extrabold">Pilgrim Login</h2>
        <p className="text-slate-600 mt-1 text-sm">
          Login with email + password to book darshan tickets.
        </p>

        <div className="mt-6 space-y-4">
          <Input
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-between text-sm text-slate-600">
            <Link className="underline text-brand-700 font-semibold" to="/pilgrim/register">
              Create account
            </Link>
            <Link className="underline text-brand-700 font-semibold" to="/pilgrim/forgot-password">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
      />
    </div>
  );
}
