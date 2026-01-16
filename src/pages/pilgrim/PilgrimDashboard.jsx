import React from "react";
import StatCard from "../../components/StatCard";
import { CalendarCheck, QrCode, BellRing, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function PilgrimDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Next Slot" value="11:30 AM" sub="Today" icon={CalendarCheck} />
        <StatCard title="Ticket Status" value="BOOKED" sub="Ready to scan" icon={QrCode} />
        <StatCard title="Alerts" value="2 New" sub="Crowd + Delay" icon={BellRing} />
        <StatCard title="Priority" value="Enabled" sub="Elderly/Women/DA" icon={ShieldCheck} />
      </div>

      <div className="bg-white border rounded-3xl shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-extrabold">Quick Actions</div>
            <div className="text-sm text-slate-600 mt-1">
              Book your slot and keep your digital ticket ready.
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/pilgrim/book-slot"
            className="px-4 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95"
          >
            Book Slot
          </Link>
          <Link
            to="/pilgrim/ticket"
            className="px-4 py-3 rounded-2xl bg-white border shadow-soft hover:bg-orange-50"
          >
            View Ticket (QR)
          </Link>
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
      </div>
    </div>
  );
}
