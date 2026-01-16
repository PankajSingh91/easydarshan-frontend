import React from "react";

export default function Deployment() {
  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Deployment Dashboard</h2>
      <p className="text-slate-600 mt-1">
        Manage personnel, barricades, and crowd control units.
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card title="Police Personnel" value="42 Active" />
        <Card title="Barricades" value="18 Deployed" />
        <Card title="Crowd Units" value="6 Teams" />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-3xl border bg-orange-50 p-6">
      <div className="text-sm text-slate-600">{title}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
    </div>
  );
}
