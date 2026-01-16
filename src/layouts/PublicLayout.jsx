import React from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { BellRing, LogIn, MapPin, Phone } from "lucide-react";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-xl text-sm font-medium transition ${
    isActive
      ? "bg-white/90 text-brand-700 shadow-soft"
      : "text-white/90 hover:bg-white/15 hover:text-white"
  }`;

export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      {/* Top strip */}
      <div className="bg-brand-800 text-white">
        <div className="container-max py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} /> Temple Crowd Info & Darshan Booking
            </span>
            <span className="hidden md:inline-flex items-center gap-1 opacity-90">
              <Phone size={14} /> Helpdesk: +91-XXXXXXXXXX
            </span>
          </div>

          <Link
            to="/announcements"
            className="inline-flex items-center gap-2 hover:underline"
          >
            <BellRing size={14} />
            Live Alerts
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-brand-700 to-brand-900 text-white sticky top-0 z-40 shadow-soft">
        <div className="container-max py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center shadow-soft">
              🛕
            </div>
            <div>
              <div className="text-lg font-bold leading-tight">
                EasyDarshan
              </div>
              <div className="text-xs opacity-90">
                Slot Booking • Crowd Safety • SOS
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
            <NavLink to="/announcements" className={navClass}>
              Notices
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/pilgrim"
              className="inline-flex items-center gap-2 bg-white text-brand-800 px-4 py-2 rounded-2xl font-semibold shadow-soft hover:opacity-95"
            >
              <LogIn size={18} />
              Pilgrim Portal
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 bg-white border-t">
        <div className="container-max py-10 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-bold text-lg">EasyDarshan</div>
            <p className="text-sm text-slate-600 mt-2">
              A smart temple crowd management system for safe and smooth pilgrimage.
            </p>
          </div>
          <div>
            <div className="font-semibold">Quick Links</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link className="hover:underline" to="/pilgrim">Book Darshan</Link>
              <Link className="hover:underline" to="/announcements">Alerts</Link>
              <Link className="hover:underline" to="/contact">Helpdesk</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold">Portals</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link className="px-3 py-2 rounded-xl bg-orange-50 border hover:bg-orange-100 text-sm" to="/admin">
                Temple Admin
              </Link>
              <Link className="px-3 py-2 rounded-xl bg-orange-50 border hover:bg-orange-100 text-sm" to="/security">
                Security
              </Link>
              <Link className="px-3 py-2 rounded-xl bg-orange-50 border hover:bg-orange-100 text-sm" to="/medical">
                Medical
              </Link>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 border-t py-4">
          <div className="container-max flex items-center justify-between">
            <span>© {new Date().getFullYear()} EasyDarshan</span>
            <span>Built for 24-hour hackathon</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
