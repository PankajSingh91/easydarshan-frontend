import React from "react";

const notices = [
  { title: "Crowd Moderate in Zone B", time: "10:10 AM", type: "Crowd Alert" },
  { title: "Entry Delay of 10 minutes", time: "10:25 AM", type: "Delay" },
  { title: "Medical Booth #2 Active", time: "10:35 AM", type: "Medical" },
];

export default function Announcements() {
  return (
    <div className="container-max py-10">
      <div className="bg-white border rounded-3xl p-8 shadow-soft">
        <h1 className="text-3xl font-extrabold">Temple Notices & Alerts</h1>
        <p className="text-slate-600 mt-2">
          Live updates about crowd, entry timings, and emergency readiness.
        </p>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {notices.map((n, idx) => (
            <div key={idx} className="p-5 rounded-3xl border bg-orange-50">
              <div className="text-xs text-slate-500">{n.type}</div>
              <div className="font-bold mt-1">{n.title}</div>
              <div className="text-sm text-slate-600 mt-1">{n.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
