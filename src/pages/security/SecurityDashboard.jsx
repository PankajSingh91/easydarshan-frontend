import React from "react";
import StatCard from "../../components/StatCard";
import { ShieldAlert, Activity, MapPinned, Users } from "lucide-react";

export default function SecurityDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Overcrowding Alerts" value="3" sub="Active" icon={ShieldAlert} />
        <StatCard title="Bottlenecks" value="1" sub="Queue Line" icon={Activity} />
        <StatCard title="Zones Monitoring" value="6" sub="Heatmap live" icon={MapPinned} />
        <StatCard title="Personnel Deployed" value="42" sub="On duty" icon={Users} />
      </div>

      <div className="bg-white border rounded-3xl shadow-soft p-6">
        <h3 className="text-xl font-extrabold">Temple Zone Heatmap (UI)</h3>
        <p className="text-sm text-slate-600 mt-1">
          Live zone risk visualization for quick action.
        </p>

        <div className="mt-5 grid md:grid-cols-3 gap-4">
          <Heat zone="Gate 1" status="SAFE" />
          <Heat zone="Queue Line" status="CRITICAL" />
          <Heat zone="Darshan Hall" status="HIGH" />
          <Heat zone="Exit" status="SAFE" />
          <Heat zone="Prasadam Area" status="MEDIUM" />
          <Heat zone="Parking" status="SAFE" />
        </div>
      </div>
    </div>
  );
}

function Heat({ zone, status }) {
  const style = {
    SAFE: "bg-green-50 border-green-200 text-green-700",
    MEDIUM: "bg-yellow-50 border-yellow-200 text-yellow-800",
    HIGH: "bg-orange-50 border-orange-200 text-orange-800",
    CRITICAL: "bg-red-50 border-red-200 text-red-700",
  };
  return (
    <div className={`rounded-3xl border p-5 ${style[status]}`}>
      <div className="text-xs opacity-70">Zone</div>
      <div className="font-bold mt-1">{zone}</div>
      <div className="text-sm font-extrabold mt-2">{status}</div>
    </div>
  );
}
