import React, { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { Stethoscope, Ambulance, Users, Siren } from "lucide-react";

/* ✅ SOCKET INSTANCE */
import { socket } from "../../config/socket";

/* ✅ API INSTANCE */
import { api } from "../../config/api";

export default function MedicalDashboard() {
  /* ✅ LIVE + PERSISTED MEDICAL SOS STATE */
  const [medicalSOS, setMedicalSOS] = useState([]);

  /* ----------------------------------------------------
     1️⃣ LOAD EXISTING MEDICAL SOS (ON REFRESH)
  ---------------------------------------------------- */
  useEffect(() => {
    async function fetchMedicalSOS() {
      try {
        const res = await api.get("/api/sos?department=MEDICAL");
        setMedicalSOS(res.data.sos || []);
      } catch (err) {
        console.error("Failed to load medical SOS", err);
      }
    }

    fetchMedicalSOS();
  }, []);

  /* ----------------------------------------------------
     2️⃣ SOCKET LISTENER (REAL-TIME)
  ---------------------------------------------------- */
  useEffect(() => {
    socket.on("SOS_ALERT", (data) => {
      console.log("🏥 MEDICAL RECEIVED SOS:", data);

      if (data.department === "MEDICAL") {
        setMedicalSOS((prev) => [data, ...prev]);
      }
    });

    return () => {
      socket.off("SOS_ALERT");
    };
  }, []);

  return (
    <div className="grid gap-6">
      {/* ---------------- STATS ---------------- */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          title="Active SOS"
          value={medicalSOS.length}
          sub="Pending dispatch"
          icon={Siren}
        />
        <StatCard
          title="Ambulances"
          value="3"
          sub="Available"
          icon={Ambulance}
        />
        <StatCard
          title="First-Aid Teams"
          value="6"
          sub="On duty"
          icon={Users}
        />
        <StatCard
          title="Medical Booths"
          value="4"
          sub="Operational"
          icon={Stethoscope}
        />
      </div>

      {/* ---------------- EMERGENCY DISPATCH PANEL ---------------- */}
      <div className="bg-white border rounded-3xl shadow-soft p-6">
        <h3 className="text-xl font-extrabold">
          Emergency Dispatch Panel
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Assign medical units to location-based SOS calls.
        </p>

        {medicalSOS.length === 0 && (
          <div className="mt-4 text-sm text-slate-500">
            No active medical emergencies.
          </div>
        )}

        <div className="mt-5 grid gap-3">
          {medicalSOS.map((sos) => (
            <SOSRow
              key={sos._id || sos.caseId}
              id={sos.caseId}
              zone={sos.zone}
              status={sos.urgency === "HIGH" ? "Critical" : "Pending"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SOS ROW (UNCHANGED UI) ---------------- */

function SOSRow({ id, zone, status }) {
  return (
    <div className="rounded-3xl border bg-orange-50 p-5 flex items-center justify-between">
      <div>
        <div className="text-xs text-slate-500">{id}</div>
        <div className="font-bold">
          Emergency Request • {zone}
        </div>
        <div className="text-sm text-slate-600">
          Status: {status}
        </div>
      </div>
      <button className="px-4 py-2 rounded-2xl bg-brand-600 text-white hover:opacity-95">
        Dispatch
      </button>
    </div>
  );
}