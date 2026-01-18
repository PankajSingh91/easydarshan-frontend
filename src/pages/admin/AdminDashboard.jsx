import React, { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { Link } from "react-router-dom";
import { Users, Activity, Settings, BellRing } from "lucide-react";
import { api } from "../../config/api";
import { socket } from "../../config/socket";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalInside: 0,
    highDensityZones: 0,
    activeSlots: 0,
    alertsTriggered: 0,
  });

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/api/admin/dashboard");
      setStats(res.data?.stats || {});
      setZones(res.data?.zones || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto refresh every 3 seconds
  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Real-time refresh on zone update or notification broadcast
  useEffect(() => {
    socket.on("zones:update", () => loadDashboard());
    socket.on("notification:broadcast", () => loadDashboard());

    return () => {
      socket.off("zones:update");
      socket.off("notification:broadcast");
    };
  }, []);

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">Admin Dashboard</h2>
          <p className="text-slate-600 mt-1">
            Live crowd density + slot control + alerts monitoring.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="px-4 py-2 rounded-2xl border bg-white hover:bg-orange-50 shadow-soft"
        >
          Refresh
        </button>
      </div>

      {/* ✅ Stat Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          title="Total Inside"
          value={stats.totalInside}
          sub="Live count"
          icon={Users}
        />
        <StatCard
          title="High Density Zones"
          value={stats.highDensityZones}
          sub="Requires action"
          icon={Activity}
        />
        <StatCard
          title="Active Slots"
          value={stats.activeSlots}
          sub="Configured today"
          icon={Settings}
        />
        <StatCard
          title="Alerts Triggered"
          value={stats.alertsTriggered}
          sub="Last 1 hour"
          icon={BellRing}
        />
      </div>

      {/* ✅ Zones */}
      <div className="bg-white border rounded-3xl shadow-soft p-6">
        <h3 className="text-xl font-extrabold">Zone-wise Crowd Density</h3>
        <p className="text-sm text-slate-600 mt-1">
          Live density status by temple zones.
        </p>

        {loading ? (
          <div className="mt-6 text-sm text-slate-600">Loading zones...</div>
        ) : (
          <div className="mt-5 grid md:grid-cols-4 gap-4">
            {zones.map((z) => (
              <ZoneCard key={z.zoneName} zone={z} />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Admin Tools */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/slot-control"
          className="px-4 py-3 rounded-2xl bg-white border shadow-soft hover:bg-orange-50"
        >
          ⚙️ Slot Control
        </Link>

        <Link
          to="/admin/delay-alerts"
          className="px-4 py-3 rounded-2xl bg-white border shadow-soft hover:bg-orange-50"
        >
          ⏳ Send Delay Alerts
        </Link>

        <Link
          to="/admin/crowd-alerts"
          className="px-4 py-3 rounded-2xl bg-white border shadow-soft hover:bg-orange-50"
        >
          🚨 Broadcast Crowd Alerts
        </Link>
      </div>
    </div>
  );
}

function ZoneCard({ zone }) {
  const map = {
    LOW: "bg-green-50 border-green-200 text-green-700",
    MODERATE: "bg-yellow-50 border-yellow-200 text-yellow-800",
    HIGH: "bg-red-50 border-red-200 text-red-700",
    CRITICAL: "bg-red-700 border-red-800 text-white",
  };

  return (
    <div className={`rounded-3xl border p-5 ${map[zone.level]}`}>
      <div className="text-xs opacity-80">Zone</div>
      <div className="font-bold mt-1">{zone.zoneName}</div>

      <div className="text-sm font-extrabold mt-2">{zone.level}</div>

      <div className="mt-2 text-xs opacity-90">
        {zone.currentCount} / {zone.maxCapacity} ({zone.percent}%)
      </div>

      <div className="mt-3 h-2 rounded-full bg-white/40 overflow-hidden">
        <div
          className="h-full bg-black/40"
          style={{ width: `${Math.min(zone.percent, 100)}%` }}
        />
      </div>
    </div>
  );
}
