import React, { useState } from "react";

export default function SlotControl() {
  const [mandatory, setMandatory] = useState(true);

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Slot Control & Enforcement</h2>
      <p className="text-slate-600 mt-1">
        Configure slot capacity and enforce mandatory booking automatically during peak hours.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl border bg-orange-50 p-6">
          <div className="font-semibold">Mandatory Booking Mode</div>
          <p className="text-sm text-slate-600 mt-1">
            When enabled, only booked pilgrims can enter during crowd surges.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={mandatory}
              onChange={(e) => setMandatory(e.target.checked)}
              className="h-5 w-5"
            />
            <span className="font-semibold">
              {mandatory ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border bg-orange-50 p-6">
          <div className="font-semibold">Slot Capacity (Sample)</div>
          <div className="mt-4 grid gap-2 text-sm">
            <CapRow slot="11:00 - 11:30" cap="250" />
            <CapRow slot="11:30 - 12:00" cap="250" />
            <CapRow slot="12:00 - 12:30" cap="200" />
          </div>
        </div>
      </div>

      <button
        onClick={() => alert("UI only ✅ Backend enforcement in next steps")}
        className="mt-6 px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95"
      >
        Save Settings
      </button>
    </div>
  );
}

function CapRow({ slot, cap }) {
  return (
    <div className="flex items-center justify-between bg-white border rounded-2xl px-4 py-3">
      <span className="font-medium">{slot}</span>
      <span className="font-mono font-bold">{cap}</span>
    </div>
  );
}
