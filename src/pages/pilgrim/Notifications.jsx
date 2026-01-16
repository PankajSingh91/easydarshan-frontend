import React from "react";

const alerts = [
  { type: "Entry Reminder", msg: "Your slot starts at 11:30 AM. Please reach Gate 2.", time: "11:10 AM" },
  { type: "Crowd Alert", msg: "Zone B is busy. Expect a delay of 10 minutes.", time: "11:20 AM" },
];

export default function Notifications() {
  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Notifications</h2>
      <p className="text-slate-600 mt-1">
        Entry reminders, delays, and zone crowd conditions.
      </p>

      <div className="mt-6 grid gap-4">
        {alerts.map((a, idx) => (
          <div key={idx} className="rounded-3xl border bg-orange-50 p-5">
            <div className="text-xs text-slate-500">{a.type} • {a.time}</div>
            <div className="font-semibold mt-1">{a.msg}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
