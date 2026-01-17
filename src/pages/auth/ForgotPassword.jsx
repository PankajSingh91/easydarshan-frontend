import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../config/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    try {
      if (!email) return alert("Enter your email");

      setLoading(true);
      const res = await api.post("/api/auth/forgot-password", { email });

      alert(res.data.message);
      navigate("/pilgrim/reset-password", { state: { email } });
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-3xl shadow-soft p-7">
        <h2 className="text-2xl font-extrabold">Forgot Password</h2>
        <p className="text-slate-600 mt-1 text-sm">
          Enter your email to receive OTP for password reset.
        </p>

        <div className="mt-6 space-y-4">
          <Input label="Email" value={email} onChange={setEmail} />

          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <div className="text-sm text-slate-600 text-center">
            Back to{" "}
            <Link className="text-brand-700 font-semibold underline" to="/pilgrim/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
        placeholder="example@gmail.com"
      />
    </div>
  );
}
