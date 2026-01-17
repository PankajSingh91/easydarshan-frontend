import React, { useState, useRef } from "react";

/* ----------------------------------------------------
   MOCK CONTEXT DATA (REPLACED BY BACKEND LATER)
---------------------------------------------------- */

const MOCK_CONTEXT = {
  ticketId: "ED-TKT-2026-0192",
  phone: "+91 98765 43210",
  slot: "11:00 - 11:30",
  zone: "Gate 2",
  zoneDensity: "HIGH", // LOW | MEDIUM | HIGH
  isPeakHour: true,
  isPriorityUser: true,
  pastSOSCount: 0,
};

const SOS_REASONS = [
  "Medical Emergency",
  "Elderly Collapse",
  "Child Missing",
  "Panic / Stampede Fear",
  "Other",
];

/* ----------------------------------------------------
   URGENCY SCORING (NO ML, PURE RULES)
---------------------------------------------------- */

function calculateUrgency(ctx) {
  let score = 0;

  if (ctx.zoneDensity === "HIGH") score += 3;
  if (ctx.isPeakHour) score += 2;
  if (ctx.isPriorityUser) score += 2;
  if (ctx.pastSOSCount > 0) score -= ctx.pastSOSCount;

  if (score >= 6) return "HIGH";
  if (score >= 3) return "MEDIUM";
  return "LOW";
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

  const timerRef = useRef(null);

  /* ---------------- LONG PRESS HANDLER ---------------- */

  const startPress = () => {
    setPressing(true);
    timerRef.current = setTimeout(() => {
      setShowConfirm(true);
      setPressing(false);
    }, 3000); // 3 seconds
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

    const urgencyScore = calculateUrgency(MOCK_CONTEXT);

    setUrgency(urgencyScore);
    setSent(true);
    setShowConfirm(false);
    setCaseId("SOS-" + Math.floor(1000 + Math.random() * 9000));
  };

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold text-red-700">Emergency SOS</h2>
      <p className="text-slate-600 mt-1">
        SOS requests are never blocked. All alerts are treated as real and prioritized intelligently.
      </p>

      {/* LOCATION & CONTEXT */}
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
          className={`w-full px-5 py-5 rounded-2xl text-white font-extrabold transition ${
            pressing ? "bg-red-800" : "bg-red-600"
          }`}
        >
          🚨 PRESS & HOLD 3 SECONDS TO SEND SOS
        </button>
        <div className="text-xs text-slate-600 mt-2 text-center">
          Long press prevents accidental activation
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="mt-6 rounded-3xl border bg-white p-5">
          <div className="font-semibold text-red-700">
            Confirm Emergency SOS
          </div>

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

      {/* SOS SENT STATUS */}
      {sent && (
        <div className="mt-6 rounded-3xl border bg-green-50 p-5">
          <div className="font-semibold text-green-700">
            SOS Sent Successfully
          </div>

          <div className="mt-2 text-sm space-y-1">
            <div>
              🆔 Case ID:{" "}
              <span className="font-mono font-bold">{caseId}</span>
            </div>
            <div>⚠ Urgency Level: <b>{urgency}</b></div>
          </div>

          <div className="mt-3 text-sm text-slate-700">
            {urgency === "HIGH" && (
              <>🚑 Nearest ambulance auto-dispatched.</>
            )}
            {urgency === "MEDIUM" && (
              <>👮 First-aid and security teams alerted.</>
            )}
            {urgency === "LOW" && (
              <>📞 Security team will confirm shortly.</>
            )}
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Note: Misuse of SOS is logged. Repeated misuse may lead to restrictions.
          </div>
        </div>
      )}
    </div>
  );
}
