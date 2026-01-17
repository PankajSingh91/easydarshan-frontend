import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../../config/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    try {
      if (!email || !otp || !newPassword)
        return alert("Enter email, OTP and new password");

      setLoading(true);
      const res = await api.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      alert(res.data.message);
      navigate("/pilgrim/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-3xl shadow-soft p-7">
        <h2 className="text-2xl font-extrabold">Reset Password</h2>
        <p className="text-slate-600 mt-1 text-sm">
          Enter OTP from email and set your new password.
        </p>

        <div className="mt-6 space-y-4">
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="OTP" value={otp} onChange={setOtp} placeholder="6-digit OTP" />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
          />

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Resetting..." : "Reset Password"}
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
