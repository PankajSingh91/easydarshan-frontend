import React, { useState, useRef } from "react";
import { api } from "../../config/api";

/* ----------------------------------------------------
   MOCK CONTEXT DATA (REPLACED BY BACKEND LATER)
---------------------------------------------------- */

const MOCK_CONTEXT = {
  ticketId: "ED-TKT-2026-0192", // placeholder
  phone: "+91 98765 43210",
  slot: "11:00 - 11:30",
  zone: "Gate 2",
  zoneDensity: "HIGH", // LOW | MEDIUM | HIGH
  isPeakHour: true,
  isPriorityUser: true,
  pastSOSCount: 0,
};

/* ----------------------------------------------------
   TEMPLE LOCATION (CONFIG)
---------------------------------------------------- */

const TEMPLE_LOCATION = {
  lat: 17.385044,
  lng: 78.486671,
};

const MAX_RADIUS_KM = 1;

/* ----------------------------------------------------
   SOS REASONS
---------------------------------------------------- */

const SOS_REASONS = [
  "Medical Emergency",
  "Elderly Collapse",
  "Child Missing",
  "Panic / Stampede Fear",
  "Other",
];

/* ----------------------------------------------------
   DISTANCE CALCULATION (HAVERSINE)
---------------------------------------------------- */

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */

export default function SOS() {
  const [pressing, setPressing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sent, setSent] = useState(false);
  const [reason, setReason] = useState("");
  const [caseId, setCaseId] = useState(null);
  const [urgency, setUrgency] = useState(null);
  const [locationError, setLocationError] = useState("");

  const timerRef = useRef(null);

  /* ---------------- LONG PRESS HANDLER ---------------- */

  const startPress = () => {
    setPressing(true);
    timerRef.current = setTimeout(() => {
      setShowConfirm(true);
      setPressing(false);
    }, 3000);
  };

  const cancelPress = () => {
    clearTimeout(timerRef.current);
    setPressing(false);
  };

  /* ---------------- SEND SOS ---------------- */

  const sendSOS = () => {
    if (!reason) {
      alert("Please select the emergency reason.");
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        const distance = getDistanceKm(
          latitude,
          longitude,
          TEMPLE_LOCATION.lat,
          TEMPLE_LOCATION.lng
        );

        const withinRadius = distance <= MAX_RADIUS_KM;

        try {
          const res = await api.post("/api/sos/trigger", {
            ticketId: MOCK_CONTEXT.ticketId,
            phone: MOCK_CONTEXT.phone,
            reason,

            // ✅ REQUIRED BY BACKEND
            zone: MOCK_CONTEXT.zone,
            zoneDensity: MOCK_CONTEXT.zoneDensity,
            isPeakHour: MOCK_CONTEXT.isPeakHour,
            isPriorityUser: MOCK_CONTEXT.isPriorityUser,
            pastSOSCount: MOCK_CONTEXT.pastSOSCount,

            // ✅ REQUIRED LOCATION FIELDS
            latitude,
            longitude,
          });


          setCaseId(res.data.caseId);
          setUrgency(res.data.urgency);
          setSent(true);
          setShowConfirm(false);
        } catch (err) {
          alert("Failed to send SOS. Please try again.");
        }
      },
      () => {
        setLocationError("Unable to fetch location");
      }
    );
  };

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold text-red-700">Emergency SOS</h2>
      <p className="text-slate-600 mt-1">
        SOS requests are never blocked. All alerts are treated as real and prioritized intelligently.
      </p>

      {/* CONTEXT */}
      <div className="mt-5 rounded-3xl border bg-red-50 p-5">
        <div className="font-semibold">Your Current Context</div>
        <div className="text-sm text-slate-700 mt-2 space-y-1">
          <div>📍 Zone: {MOCK_CONTEXT.zone}</div>
          <div>🎫 Ticket ID: {MOCK_CONTEXT.ticketId}</div>
          <div>🕒 Slot: {MOCK_CONTEXT.slot}</div>
          <div>📞 Phone: {MOCK_CONTEXT.phone}</div>
        </div>
      </div>

      {/* SOS BUTTON */}
      <div className="mt-6">
        <button
          onMouseDown={startPress}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          className={`w-full px-5 py-5 rounded-2xl text-white font-extrabold transition ${pressing ? "bg-red-800" : "bg-red-600"
            }`}
        >
          🚨 PRESS & HOLD 3 SECONDS TO SEND SOS
        </button>
        <div className="text-xs text-slate-600 mt-2 text-center">
          Long press prevents accidental activation
        </div>
      </div>

      {/* CONFIRMATION */}
      {showConfirm && (
        <div className="mt-6 rounded-3xl border bg-white p-5">
          <div className="font-semibold text-red-700">Confirm Emergency SOS</div>

          <div className="mt-3 text-sm">
            Are you in an emergency? This will alert medical and security teams.
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold">Select Reason *</div>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-2xl border"
            >
              <option value="">Select reason</option>
              {SOS_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={sendSOS}
              className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold"
            >
              Confirm SOS
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-3 rounded-xl border font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* STATUS */}
      {sent && (
        <div className="mt-6 rounded-3xl border bg-green-50 p-5">
          <div className="font-semibold text-green-700">
            SOS Sent Successfully
          </div>

          <div className="mt-2 text-sm space-y-1">
            <div>🆔 Case ID: <b>{caseId}</b></div>
            <div>⚠ Urgency Level: <b>{urgency}</b></div>
          </div>
        </div>
      )}

      {locationError && (
        <div className="mt-4 text-xs text-red-600">{locationError}</div>
      )}
    </div>
  );
}