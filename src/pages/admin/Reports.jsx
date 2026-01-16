import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { slot: "06:00", count: 120 },
  { slot: "08:00", count: 280 },
  { slot: "10:00", count: 360 },
  { slot: "12:00", count: 420 },
  { slot: "14:00", count: 240 },
  { slot: "16:00", count: 310 },
  { slot: "18:00", count: 460 },
];

export default function Reports() {
  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Daily Footfall & Peak Hours</h2>
      <p className="text-slate-600 mt-1">
        Reports help optimize personnel and barricade allocation.
      </p>

      <div className="mt-6 h-72 rounded-3xl border bg-orange-50 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="slot" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
