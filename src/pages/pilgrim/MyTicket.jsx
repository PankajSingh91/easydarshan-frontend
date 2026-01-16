import React from "react";

export default function MyTicket() {
  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">My Digital Ticket</h2>
      <p className="text-slate-600 mt-1">
        Show this QR at the entry gate for verification.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6 items-start">
        <div className="rounded-3xl border bg-orange-50 p-6">
          <div className="text-sm text-slate-500">Ticket ID</div>
          <div className="font-mono font-bold text-lg mt-1">ED-2025-00091</div>

          <div className="mt-4 text-sm text-slate-500">Slot</div>
          <div className="font-semibold mt-1">11:30 AM - 12:00 PM</div>

          <div className="mt-4 text-sm text-slate-500">Priority</div>
          <div className="font-semibold mt-1">Women with Children</div>
        </div>

        <div className="rounded-3xl border p-6 text-center">
          <div className="text-sm text-slate-500">QR Code (UI Placeholder)</div>
          <div className="mt-4 h-56 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-mono">
            QR: ED-2025-00091
          </div>

          <button
            onClick={() => alert("UI only ✅ QR generation in next backend step")}
            className="mt-5 px-4 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95"
          >
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
