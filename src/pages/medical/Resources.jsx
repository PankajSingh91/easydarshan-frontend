import React from "react";

export default function Resources() {
  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Medical Resources</h2>
      <p className="text-slate-600 mt-1">
        Live mapping of booths, ambulances and first-aid teams (UI).
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Resource title="Ambulance A1" status="Available" />
        <Resource title="Ambulance A2" status="Busy" />
        <Resource title="First Aid Team T3" status="Available" />
      </div>
    </div>
  );
}

function Resource({ title, status }) {
  const badge =
    status === "Available"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className="rounded-3xl border bg-orange-50 p-6">
      <div className="font-bold">{title}</div>
      <div className={`mt-3 inline-flex px-3 py-1 rounded-2xl border text-xs font-semibold ${badge}`}>
        {status}
      </div>
    </div>
  );
}
