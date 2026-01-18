import React, { useEffect, useState } from "react";
import { api } from "../../config/api";
import { socket } from "../../config/socket";

const typeStyles = {
  REMINDER: "bg-green-50 border-green-200 text-green-800",
  DELAY: "bg-orange-50 border-orange-200 text-orange-800",
  CROWD: "bg-red-50 border-red-200 text-red-800",
  GENERAL: "bg-slate-50 border-slate-200 text-slate-800",
};

const typeLabel = {
  REMINDER: "Entry Reminder",
  DELAY: "Delay Alert",
  CROWD: "Crowd Alert",
  GENERAL: "General Alert",
};

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMyNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/notifications/my");
      setList(res.data?.notifications || []);
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ 1) Load old notifications from DB
    loadMyNotifications();

    // ✅ 2) Join user room for personal socket notifications
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.userId) {
      socket.emit("join-user-room", user.userId);
    }

    // ✅ 3) Listen for new personal notifications
    socket.on("notification:new", (notif) => {
      setList((prev) => [notif, ...prev]);
    });

    // ✅ 4) Listen for broadcast notifications (crowd alerts)
    socket.on("notification:broadcast", (notif) => {
      setList((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("notification:new");
      socket.off("notification:broadcast");
    };
  }, []);

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-extrabold">Notifications</h2>
          <p className="text-slate-600 mt-1">
            Entry reminders, delays, and zone crowd conditions (Live).
          </p>
        </div>

        <button
          onClick={loadMyNotifications}
          className="px-4 py-2 rounded-2xl border bg-white hover:bg-orange-50 shadow-soft"
        >
          Refresh
        </button>
      </div>

      {/* ✅ Loading */}
      {loading && (
        <div className="mt-6 text-sm text-slate-600">Loading notifications...</div>
      )}

      {/* ✅ Empty */}
      {!loading && list.length === 0 && (
        <div className="mt-6 rounded-3xl border bg-slate-50 p-6 text-slate-600">
          No alerts yet ✅
        </div>
      )}

      {/* ✅ Alerts */}
      <div className="mt-6 grid gap-4">
        {list.map((n) => {
          const style = typeStyles[n.type] || typeStyles.GENERAL;
          const label = typeLabel[n.type] || "Alert";

          return (
            <div
              key={n._id}
              className={`rounded-3xl border p-5 ${style}`}
            >
              <div className="flex justify-between items-center gap-3 flex-wrap">
                <div className="text-xs font-semibold uppercase tracking-wide">
                  {label}
                </div>
                <div className="text-xs opacity-80">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="font-semibold mt-2">{n.title}</div>
              <div className="text-sm mt-1">{n.message}</div>

              {/* ✅ Extra Info */}
              {(n.date || n.slotTime || n.zoneName) && (
                <div className="mt-2 text-xs opacity-80 flex gap-3 flex-wrap">
                  {n.date && <span>📅 {n.date}</span>}
                  {n.slotTime && <span>⏱️ {n.slotTime}</span>}
                  {n.zoneName && <span>📍 {n.zoneName}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
