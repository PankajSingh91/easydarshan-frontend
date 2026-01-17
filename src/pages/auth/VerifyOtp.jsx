import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../../config/api";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      if (!email || !otp) return alert("Enter email and OTP");

      setLoading(true);
      const res = await api.post("/api/auth/verify-otp", { email, otp });

      alert(res.data.message);

      navigate("/pilgrim/login");
    } catch (err) {
      alert(err?.response?.data?.message || "OTP verify failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-3xl shadow-soft p-7">
        <h2 className="text-2xl font-extrabold">Verify Email OTP</h2>
        <p className="text-slate-600 mt-1 text-sm">
          Enter the OTP sent to your email.
        </p>

        <div className="mt-6 space-y-4">
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="OTP" value={otp} onChange={setOtp} placeholder="6-digit OTP" />

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify OTP"}
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

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
      />
    </div>
  );
}
