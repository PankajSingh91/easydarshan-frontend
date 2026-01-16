import React, { useState } from "react";

export default function SOS() {
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold text-red-700">Emergency SOS</h2>
      <p className="text-slate-600 mt-1">
        Raise SOS to the nearest medical/security unit with location-based dispatch.
      </p>

      <div className="mt-6 rounded-3xl border bg-red-50 p-6">
        <div className="font-semibold">Your current location</div>
        <div className="text-sm text-slate-600 mt-1">
          Temple Zone: Gate 2 (Mock Location)
        </div>

        <button
          onClick={() => setSent(true)}
          className="mt-5 w-full px-5 py-4 rounded-2xl bg-red-600 text-white font-extrabold hover:opacity-95"
        >
          🚨 SEND SOS NOW
        </button>

        {sent && (
          <div className="mt-4 rounded-2xl bg-white border p-4">
            ✅ SOS Sent Successfully! <br />
            Case ID: <span className="font-mono font-bold">SOS-0093</span>
          </div>
        )}
      </div>
    </div>
  );
}
