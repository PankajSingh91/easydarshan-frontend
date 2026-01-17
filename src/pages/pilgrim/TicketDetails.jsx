import React, { useEffect, useState } from "react";
import { api } from "../../config/api";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function TicketDetails() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/tickets/${ticketId}`);
      setTicket(res.data?.ticket);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  if (loading) return <div className="p-6">Loading Ticket...</div>;
  if (!ticket) return <div className="p-6">Ticket not found</div>;

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">Your Ticket</h2>
          <div className="mt-2 text-slate-600">
            Ticket ID: <b>{ticket.ticketId}</b>
          </div>
          <div className="text-slate-600">
            {ticket.date} • {ticket.slotTime} • {ticket.darshanType}
          </div>
          <div className="text-slate-600">
            Persons: <b>{ticket.personsCount}</b> • Status:{" "}
            <b className="text-brand-700">{ticket.status}</b>
          </div>
        </div>

        {/* ✅ QR */}
        <div className="border rounded-3xl p-4 bg-orange-50 text-center">
          <div className="font-semibold mb-2">Scan at Gate</div>

          <QRCodeCanvas value={ticket.ticketId} size={150} />

          <div className="text-xs text-slate-600 mt-2">{ticket.ticketId}</div>
        </div>
      </div>

      {/* ✅ Pilgrims */}
      <div className="mt-8">
        <h3 className="text-lg font-extrabold">Pilgrim List</h3>

        <div className="mt-4 space-y-4">
          {ticket.pilgrims.map((p, index) => (
            <div key={index} className="rounded-3xl border p-4 bg-white">
              <div className="flex justify-between flex-wrap gap-2">
                <div>
                  <div className="font-bold">
                    Person {index + 1}: {p.fullName}
                  </div>
                  <div className="text-sm text-slate-600">
                    {p.gender} • DOB: {p.dob} • Phone: {p.phone}
                  </div>
                  <div className="text-sm text-slate-600">
                    ID: {p.idType} • {p.idNumber}
                  </div>
                </div>

                {p.priorityEnabled ? (
                  <div className="text-xs px-3 py-2 rounded-2xl bg-orange-100 border">
                    ✅ Priority ({p.priorityType})
                  </div>
                ) : (
                  <div className="text-xs px-3 py-2 rounded-2xl bg-slate-100 border">
                    Normal
                  </div>
                )}
              </div>

              {p.priorityEnabled && (
                <div className="mt-3 text-sm text-slate-700">
                  Proof: {p.proofType} • Ref: {p.proofNumber}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={fetchTicket}
        className="mt-6 px-4 py-2 rounded-2xl border bg-white hover:bg-orange-50"
      >
        Refresh Ticket Status
      </button>
    </div>
  );
}
