import React from "react";
import StatCard from "../../components/StatCard";
import { Stethoscope, Ambulance, Users, Siren } from "lucide-react";

export default function MedicalDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Active SOS" value="2" sub="Pending dispatch" icon={Siren} />
        <StatCard title="Ambulances" value="3" sub="Available" icon={Ambulance} />
        <StatCard title="First-Aid Teams" value="6" sub="On duty" icon={Users} />
        <StatCard title="Medical Booths" value="4" sub="Operational" icon={Stethoscope} />
      </div>

      <div className="bg-white border rounded-3xl shadow-soft p-6">
        <h3 className="text-xl font-extrabold">Emergency Dispatch Panel</h3>
        <p className="text-sm text-slate-600 mt-1">
          Assign medical units to location-based SOS calls.
        </p>

        <div className="mt-5 grid gap-3">
          <SOSRow id="SOS-0093" zone="Gate 2" status="Pending" />
          <SOSRow id="SOS-0094" zone="Queue Line" status="Assigned" />
        </div>
      </div>
    </div>
  );
}

function SOSRow({ id, zone, status }) {
  return (
    <div className="rounded-3xl border bg-orange-50 p-5 flex items-center justify-between">
      <div>
        <div className="text-xs text-slate-500">{id}</div>
        <div className="font-bold">Emergency Request • {zone}</div>
        <div className="text-sm text-slate-600">Status: {status}</div>
      </div>
      <button className="px-4 py-2 rounded-2xl bg-brand-600 text-white hover:opacity-95">
        Dispatch
      </button>
    </div>
  );
}
