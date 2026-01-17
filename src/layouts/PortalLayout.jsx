import React from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  Bell,
  ShieldAlert,
  Stethoscope,
  Settings,
  BookOpen,
  FileText,
  Users,
  Siren,
  MapPinned,
  LogOut,
  QrCode,
} from "lucide-react";

const navItem = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-2xl transition text-sm font-medium ${isActive
    ? "bg-brand-600 text-white shadow-soft"
    : "text-slate-700 hover:bg-orange-50"
  }`;

function getNav(role) {
  if (role === "pilgrim") {
    return [
      { to: "/pilgrim", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/pilgrim/book-slot", icon: BookOpen, label: "Book Slot" },
      { to: "/pilgrim/ticket", icon: Ticket, label: "My Ticket" },
      { to: "/pilgrim/notifications", icon: Bell, label: "Notifications" },
      { to: "/pilgrim/sos", icon: Siren, label: "Emergency SOS" },

    ];
  }

  if (role === "admin") {
    return [
      { to: "/admin", icon: LayoutDashboard, label: "Live Dashboard" },
      { to: "/admin/slot-control", icon: Settings, label: "Slot Control" },
      { to: "/admin/reports", icon: FileText, label: "Reports" },
      { to: "/admin/scan", icon: QrCode, label: "QR Gate Verification" },

    ];
  }

  if (role === "security") {
    return [
      { to: "/security", icon: MapPinned, label: "Heatmap & Alerts" },
      { to: "/security/deployment", icon: Users, label: "Deployment" },
      { to: "/security/incidents", icon: ShieldAlert, label: "Incidents" },
    ];
  }

  return [
    { to: "/medical", icon: Stethoscope, label: "Emergency Dashboard" },
    { to: "/medical/resources", icon: Users, label: "Resources" },
    { to: "/medical/emergency-log", icon: FileText, label: "SOS Logs" },
  ];
}

export default function PortalLayout({ role, title }) {
  const location = useLocation();
  const nav = getNav(role);

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="container-max py-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-3xl shadow-soft border p-4 h-fit sticky top-6">
            <Link to="/" className="flex items-center gap-3 px-2 py-2">
              <div className="h-10 w-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center">
                🛕
              </div>
              <div>
                <div className="font-bold leading-tight">DevDarshanam</div>
                <div className="text-xs text-slate-500">{title}</div>
              </div>
            </Link>

            <div className="mt-4 flex flex-col gap-2">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} className={navItem} end>
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>

            {role !== "pilgrim" && (
              <div className="mt-6 border-t pt-4">
                <div className="text-xs text-slate-500 px-2">Switch Portals</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {role !== "admin" && (
                    <Link to="/admin" className="px-3 py-2 rounded-xl bg-orange-50 border text-xs hover:bg-orange-100">
                      Admin
                    </Link>
                  )}
                  {role !== "security" && (
                    <Link to="/security" className="px-3 py-2 rounded-xl bg-orange-50 border text-xs hover:bg-orange-100">
                      Security
                    </Link>
                  )}
                  {role !== "medical" && (
                    <Link to="/medical" className="px-3 py-2 rounded-xl bg-orange-50 border text-xs hover:bg-orange-100">
                      Medical
                    </Link>
                  )}
                </div>
              </div>
            )}


            <button className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white hover:opacity-95">
              <LogOut size={18} />
              Logout (UI)
            </button>
          </aside>

          {/* Main */}
          <section>
            {/* Topbar */}
            <div className="bg-white rounded-3xl shadow-soft border p-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">You are viewing</div>
                <div className="text-xl font-bold">{title}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Current route: <span className="font-mono">{location.pathname}</span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <div className="px-3 py-2 rounded-2xl bg-orange-50 border text-sm">
                  Status: <span className="font-semibold text-green-700">LIVE</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
