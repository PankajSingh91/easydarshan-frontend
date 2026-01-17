import React, { useEffect, useState } from "react";
import { api } from "../../config/api";
import { Link } from "react-router-dom";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/tickets/my");
      setTickets(res.data?.tickets || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-extrabold">My Tickets</h2>
        <button
          onClick={fetchTickets}
          className="px-4 py-2 rounded-2xl border bg-white hover:bg-orange-50"
        >
          Refresh
        </button>
      </div>

      {loading && <div className="mt-4 text-slate-600">Loading tickets...</div>}

      {!loading && tickets.length === 0 && (
        <div className="mt-4 text-slate-600">No tickets booked yet.</div>
      )}

      <div className="mt-6 space-y-4">
        {tickets.map((t) => (
          <div key={t.ticketId} className="rounded-3xl border p-5 bg-orange-50">
            <div className="flex justify-between flex-wrap gap-2">
              <div>
                <div className="font-bold text-lg">Ticket ID: {t.ticketId}</div>
                <div className="text-sm text-slate-600">
                  {t.date} • {t.slotTime} • {t.darshanType}
                </div>
                <div className="text-sm mt-1">
                  Persons: <b>{t.personsCount}</b> • Status:{" "}
                  <b className="text-brand-700">{t.status}</b>
                </div>
              </div>

              <Link
                to={`/pilgrim/ticket/${t.ticketId}`}
                className="px-4 py-2 rounded-2xl bg-brand-600 text-white font-semibold"
              >
                View Ticket
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
