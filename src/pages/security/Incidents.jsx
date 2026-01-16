import React from "react";

const incidents = [
  { id: "INC-001", type: "Bottleneck", zone: "Queue Line", status: "Open" },
  { id: "INC-002", type: "Overcrowding", zone: "Darshan Hall", status: "In Progress" },
];

export default function Incidents() {
  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Incident Reporting</h2>
      <p className="text-slate-600 mt-1">
        Report, escalate and track crowd-related incidents.
      </p>

      <div className="mt-6 grid gap-3">
        {incidents.map((i) => (
          <div key={i.id} className="rounded-3xl border bg-orange-50 p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">{i.id}</div>
              <div className="font-bold">{i.type} • {i.zone}</div>
              <div className="text-sm text-slate-600">Status: {i.status}</div>
            </div>
            <button className="px-4 py-2 rounded-2xl bg-slate-900 text-white hover:opacity-95">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
