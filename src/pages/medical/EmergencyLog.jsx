import React from "react";

const logs = [
  { id: "SOS-0091", zone: "Gate 1", status: "Resolved" },
  { id: "SOS-0092", zone: "Darshan Hall", status: "Resolved" },
  { id: "SOS-0093", zone: "Gate 2", status: "Pending" },
];

export default function EmergencyLog() {
  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Emergency Logs</h2>
      <p className="text-slate-600 mt-1">
        Incident logging and response tracking.
      </p>

      <div className="mt-6 grid gap-3">
        {logs.map((l) => (
          <div key={l.id} className="rounded-3xl border bg-orange-50 p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">{l.id}</div>
              <div className="font-bold">Zone: {l.zone}</div>
              <div className="text-sm text-slate-600">Status: {l.status}</div>
            </div>
            <button className="px-4 py-2 rounded-2xl bg-slate-900 text-white hover:opacity-95">
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
