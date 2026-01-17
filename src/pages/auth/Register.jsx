import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../config/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      if (!form.email || !form.password) return alert("Enter email and password");

      setLoading(true);
      const res = await api.post("/api/auth/register", form);

      alert(res.data.message);

      // ✅ move to OTP verify page
      navigate("/pilgrim/verify-otp", { state: { email: form.email } });
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-3xl shadow-soft p-7">
        <h2 className="text-2xl font-extrabold">Create Pilgrim Account</h2>
        <p className="text-slate-600 mt-1 text-sm">
          Register with email + password and verify OTP to continue.
        </p>

        <div className="mt-6 space-y-4">
          <Input
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="example@gmail.com"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            placeholder="Create a password"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Register & Get OTP"}
          </button>

          <div className="text-sm text-slate-600 text-center">
            Already have an account?{" "}
            <Link className="text-brand-700 font-semibold underline" to="/pilgrim/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
      />
    </div>
  );
}
