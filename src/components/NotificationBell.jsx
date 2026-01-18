import React, { useEffect, useState } from "react";
import { socket } from "../config/socket";
import { api } from "../config/api";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);

  const loadNotifications = async () => {
    const res = await api.get("/api/notifications/my");
    setList(res.data?.notifications || []);
  };

  useEffect(() => {
    loadNotifications();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.userId) {
      socket.emit("join-user-room", user.userId);
    }

    socket.on("notification:new", (notif) => {
      setList((prev) => [notif, ...prev]);
    });

    socket.on("notification:broadcast", (notif) => {
      setList((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("notification:new");
      socket.off("notification:broadcast");
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 rounded-2xl border bg-white hover:bg-orange-50"
      >
        🔔 Alerts ({list.length})
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[340px] bg-white border rounded-2xl shadow-soft p-3 z-50">
          <div className="font-bold mb-2">Live Alerts</div>

          <div className="max-h-[320px] overflow-auto space-y-2">
            {list.length === 0 && (
              <div className="text-sm text-slate-600">No alerts yet.</div>
            )}

            {list.map((n) => (
              <div key={n._id} className="rounded-2xl border p-3 bg-orange-50">
                <div className="font-semibold text-sm">{n.title}</div>
                <div className="text-xs text-slate-700 mt-1">{n.message}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={loadNotifications}
            className="mt-3 w-full px-3 py-2 rounded-2xl border bg-white hover:bg-orange-50"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
