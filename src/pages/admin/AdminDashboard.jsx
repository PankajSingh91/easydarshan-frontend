import React from "react";
import StatCard from "../../components/StatCard";
import { Users, Activity, Settings, BellRing } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Total Inside" value="2,140" sub="Live count" icon={Users} />
        <StatCard title="High Density Zones" value="2" sub="Requires action" icon={Activity} />
        <StatCard title="Active Slots" value="6" sub="Configured today" icon={Settings} />
        <StatCard title="Alerts Triggered" value="5" sub="Last 1 hour" icon={BellRing} />
      </div>

      <div className="bg-white border rounded-3xl shadow-soft p-6">
        <h3 className="text-xl font-extrabold">Zone-wise Crowd Density</h3>
        <p className="text-sm text-slate-600 mt-1">Live density status by temple zones.</p>

        <div className="mt-5 grid md:grid-cols-4 gap-4">
          <Zone name="Gate 1" level="LOW" />
          <Zone name="Gate 2" level="MODERATE" />
          <Zone name="Queue Line" level="HIGH" />
          <Zone name="Darshan Hall" level="HIGH" />
        </div>
      </div>
    </div>
  );
}

function Zone({ name, level }) {
  const map = {
    LOW: "bg-green-50 border-green-200 text-green-700",
    MODERATE: "bg-yellow-50 border-yellow-200 text-yellow-800",
    HIGH: "bg-red-50 border-red-200 text-red-700",
  };
  return (
    <div className={`rounded-3xl border p-5 ${map[level]}`}>
      <div className="text-xs opacity-80">Zone</div>
      <div className="font-bold mt-1">{name}</div>
      <div className="text-sm font-extrabold mt-2">{level}</div>
    </div>
  );
}
