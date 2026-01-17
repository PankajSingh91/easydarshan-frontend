import React, { useState } from "react";
import { api, API_BASE_URL } from "../../config/api";
import { QRCodeCanvas } from "qrcode.react";

export default function MyTicket() {
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTicket = async () => {
    try {
      if (!ticketId) return alert("Enter Ticket ID");
      setLoading(true);

      const res = await api.get(`/api/tickets/${ticketId}`);
      setTicket(res.data.ticket);
    } catch (err) {
      alert(err?.response?.data?.message || "Ticket not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">My Digital Ticket</h2>
      <p className="text-slate-600 mt-1">
        Enter your Ticket ID and view your QR ticket.
      </p>

      <div className="mt-6 flex gap-3 flex-wrap">
        <input
          className="px-4 py-3 rounded-2xl border w-full md:w-[320px]"
          placeholder="Enter Ticket ID (eg: ED-2026-35300)"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
        />
        <button
          onClick={fetchTicket}
          className="px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95"
        >
          {loading ? "Loading..." : "Fetch Ticket"}
        </button>
      </div>

      {ticket && (
        <div className="mt-6 grid md:grid-cols-2 gap-6 items-start">
          <div className="rounded-3xl border bg-orange-50 p-6">
            <div className="text-sm text-slate-500">Ticket ID</div>
            <div className="font-mono font-bold text-lg mt-1">
              {ticket.ticketId}
            </div>

            <div className="mt-4 text-sm text-slate-500">Name</div>
            <div className="font-semibold mt-1">{ticket.name}</div>

            <div className="mt-4 text-sm text-slate-500">Slot</div>
            <div className="font-semibold mt-1">
              {ticket.date} • {ticket.slotTime}
            </div>

            <div className="mt-4 text-sm text-slate-500">Priority</div>
            <div className="font-semibold mt-1">
              {ticket.priorityEnabled ? ticket.priorityType : "No"}
            </div>

            <div className="mt-4 text-sm text-slate-500">Status</div>
            <div className="font-extrabold mt-1">{ticket.status}</div>

            {ticket.idProofFile && (
              <div className="mt-4">
                <a
                  href={`${API_BASE_URL}/uploads/${ticket.idProofFile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-brand-700 font-semibold underline"
                >
                  View Uploaded ID Proof
                </a>
              </div>
            )}
          </div>

          <div className="rounded-3xl border p-6 text-center">
            <div className="text-sm text-slate-500">QR Code</div>

            <div className="mt-5 flex justify-center">
              <div className="bg-white border rounded-3xl p-4 shadow-soft">
                <QRCodeCanvas value={ticket.ticketId} size={210} />
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Scan this QR at the entry gate.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
