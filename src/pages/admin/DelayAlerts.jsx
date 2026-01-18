import React, { useEffect, useState } from "react";
import { api } from "../../config/api";

const DARSHAN_TYPES = ["GENERAL", "SEEGHRA"];

export default function DelayAlerts() {
  const [darshanType, setDarshanType] = useState("GENERAL");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotTime, setSlotTime] = useState("");

  const [delayMinutes, setDelayMinutes] = useState(10);
  const [message, setMessage] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [sending, setSending] = useState(false);

  // ✅ Load slots for selected date + type
  const fetchSlots = async () => {
    try {
      setSlots([]);
      setSlotTime("");

      if (!date) return;

      setLoadingSlots(true);

      const res = await api.get(
        `/api/slots/by-date?date=${date}&darshanType=${darshanType}`
      );

      const list = res.data?.slots || [];

      setSlots(list);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, darshanType]);

  // ✅ Send delay notification
  const sendDelayAlert = async () => {
    try {
      if (!date || !slotTime || !delayMinutes) {
        alert("Please select date, slot and delay minutes");
        return;
      }

      setSending(true);

      const res = await api.post("/api/notifications/admin/delay", {
        date,
        slotTime,
        darshanType,
        delayMinutes: Number(delayMinutes),
        message:
          message?.trim() ||
          `Your darshan slot is delayed by ${delayMinutes} minutes. Please cooperate.`,
      });

      alert(res.data?.message || "✅ Delay alert sent!");

      setMessage("");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send delay alert");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Delay Alerts (Admin)</h2>
      <p className="text-slate-600 mt-1">
        Send live delay notifications to pilgrims based on slot + darshan type.
      </p>

      {/* ✅ Filters */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm font-semibold">Darshan Type *</div>
          <select
            value={darshanType}
            onChange={(e) => setDarshanType(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
          >
            {DARSHAN_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-sm font-semibold">Date *</div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-2xl border"
          />
        </div>

        <div>
          <div className="text-sm font-semibold">Slot Time *</div>

          {loadingSlots ? (
            <div className="mt-2 text-sm text-slate-600">Loading slots...</div>
          ) : (
            <select
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
            >
              <option value="">Select Slot</option>
              {slots.map((s) => (
                <option key={s._id} value={s.timeRange}>
                  {s.timeRange} (Booked: {s.bookedCount})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ✅ Delay Details */}
      <div className="mt-6 rounded-3xl border bg-orange-50 p-6">
        <div className="font-semibold">Delay Details</div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-semibold">Delay Minutes *</div>
            <input
              type="number"
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
              min={1}
            />
          </div>

          <div>
            <div className="text-sm font-semibold">Custom Message (Optional)</div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Example: Gate 2 crowd issue, please wait 10 mins..."
              className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
            />
          </div>
        </div>

        <button
          onClick={sendDelayAlert}
          disabled={sending}
          className="mt-5 px-6 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95 disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send Delay Alert"}
        </button>

        <div className="text-xs text-slate-600 mt-3">
          This will notify only pilgrims who booked this <b>date + slot + darshan type</b>.
        </div>
      </div>
    </div>
  );
}
