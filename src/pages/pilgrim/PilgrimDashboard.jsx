import React, { useEffect, useMemo, useState } from "react";
import StatCard from "../../components/StatCard";
import { CalendarCheck, QrCode, BellRing, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../config/api";
import { socket } from "../../config/socket";

export default function PilgrimDashboard() {
  const [loading, setLoading] = useState(true);

  const [latestTicket, setLatestTicket] = useState(null);
  const [alertsCount, setAlertsCount] = useState(0);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // ✅ Get latest ticket of logged-in user
      const tRes = await api.get("/api/tickets/my-latest");
      setLatestTicket(tRes.data?.ticket || null);

      // ✅ Get notification count (new/unread)
      const nRes = await api.get("/api/notifications/my-count");
      setAlertsCount(nRes.data?.count || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto refresh every 5s (safe backup)
  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ REAL-TIME updates using socket
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.userId) {
      socket.emit("join-user-room", user.userId);
    }

    socket.on("ticket:update", () => {
      loadDashboard();
    });

    socket.on("notification:new", () => {
      setAlertsCount((prev) => prev + 1);
    });

    socket.on("notification:broadcast", () => {
      setAlertsCount((prev) => prev + 1);
    });

    return () => {
      socket.off("ticket:update");
      socket.off("notification:new");
      socket.off("notification:broadcast");
    };
  }, []);

  // ✅ Derived UI fields
  const nextSlotText = useMemo(() => {
    if (!latestTicket) return "-";
    return `${latestTicket.slotTime}`;
  }, [latestTicket]);

  const ticketStatusText = useMemo(() => {
    if (!latestTicket) return "NO TICKET";
    return latestTicket.status || "BOOKED";
  }, [latestTicket]);

  const priorityText = useMemo(() => {
    if (!latestTicket) return "Disabled";

    const pCount =
      latestTicket.priorityCount ??
      (latestTicket.pilgrims || []).filter((p) => p.priorityEnabled).length;

    return pCount > 0 ? `Enabled (${pCount})` : "Disabled";
  }, [latestTicket]);

  const latestTicketId = latestTicket?.ticketId;

  return (
    <div className="grid gap-6">
      {/* ✅ Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          title="Next Slot"
          value={loading ? "..." : nextSlotText}
          sub={latestTicket ? latestTicket.date : "No booking"}
          icon={CalendarCheck}
        />

        <StatCard
          title="Ticket Status"
          value={loading ? "..." : ticketStatusText}
          sub={latestTicket ? "Ready to scan" : "Book a slot"}
          icon={QrCode}
        />

        <StatCard
          title="Alerts"
          value={loading ? "..." : `${alertsCount} New`}
          sub="Crowd + Delay + Reminder"
          icon={BellRing}
        />

        <StatCard
          title="Priority"
          value={loading ? "..." : priorityText}
          sub="Elderly / Women / DA / Pregnant"
          icon={ShieldCheck}
        />
      </div>

      {/* ✅ Quick Actions */}
      <div className="bg-white border rounded-3xl shadow-soft p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xl font-extrabold">Quick Actions</div>
            <div className="text-sm text-slate-600 mt-1">
              Book your slot and keep your digital ticket ready.
            </div>
          </div>

          <button
            onClick={loadDashboard}
            className="px-4 py-2 rounded-2xl border bg-white hover:bg-orange-50 shadow-soft"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/pilgrim/book-slot"
            className="px-4 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95"
          >
            Book Slot
          </Link>

          {/* ✅ Auto-open latest ticket */}
          {latestTicketId ? (
            <Link
              to={`/pilgrim/ticket/${latestTicketId}`}
              className="px-4 py-3 rounded-2xl bg-white border shadow-soft hover:bg-orange-50"
            >
              View Ticket (QR)
            </Link>
          ) : (
            <button
              disabled
              className="px-4 py-3 rounded-2xl bg-white border shadow-soft opacity-60 cursor-not-allowed"
            >
              View Ticket (QR)
            </button>
          )}

          <Link
            to="/pilgrim/notifications"
            className="px-4 py-3 rounded-2xl bg-white border shadow-soft hover:bg-orange-50"
          >
            Notifications
          </Link>

          <Link
            to="/pilgrim/sos"
            className="px-4 py-3 rounded-2xl bg-red-600 text-white font-semibold hover:opacity-95"
          >
            Emergency SOS
          </Link>
        </div>

        {/* ✅ Ticket summary */}
        {latestTicket && (
          <div className="mt-6 rounded-3xl border bg-orange-50 p-5">
            <div className="font-semibold">Current Booking</div>

            <div className="mt-2 text-sm text-slate-700">
              🎫 <b>{latestTicket.ticketId}</b> • {latestTicket.date} •{" "}
              {latestTicket.slotTime} • {latestTicket.darshanType}
            </div>

            <div className="mt-1 text-sm text-slate-700">
              👥 Persons: <b>{latestTicket.personsCount}</b> • Priority:{" "}
              <b>{priorityText}</b>
            </div>

            <div className="mt-2 text-sm text-slate-700">
              🚪 Gate: <b>{latestTicket.assignedGate || "Main Gate"}</b> • Zone:{" "}
              <b>{latestTicket.assignedZone || "Gate 1"}</b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
