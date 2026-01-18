import React, { useState } from "react";
import { api } from "../../config/api";

const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Main Queue"];
const LEVELS = ["LOW", "MODERATE", "HIGH", "CRITICAL"];

export default function CrowdAlerts() {
  const [zoneName, setZoneName] = useState("Zone B");
  const [level, setLevel] = useState("HIGH");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);

  const sendCrowdAlert = async () => {
    try {
      if (!zoneName || !level) {
        alert("Zone and level required");
        return;
      }

      setSending(true);

      const res = await api.post("/api/notifications/admin/crowd", {
        zoneName,
        level,
        message:
          message?.trim() ||
          `${zoneName} crowd level is ${level}. Please follow security instructions.`,
      });

      alert(res.data?.message || "✅ Crowd alert broadcasted!");
      setMessage("");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to broadcast crowd alert");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Crowd Alerts (Admin)</h2>
      <p className="text-slate-600 mt-1">
        Broadcast real-time crowd and safety alerts to all pilgrims.
      </p>

      {/* ✅ Alert Config */}
      <div className="mt-6 rounded-3xl border bg-orange-50 p-6">
        <div className="font-semibold">Alert Configuration</div>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {/* Zone */}
          <div>
            <div className="text-sm font-semibold">Zone *</div>
            <select
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
            >
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <div className="text-sm font-semibold">Crowd Level *</div>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Badge Preview */}
          <div>
            <div className="text-sm font-semibold">Preview</div>
            <div className="mt-2 px-4 py-3 rounded-2xl border bg-white text-sm">
              <span className="font-bold">🚨 Crowd Alert:</span>{" "}
              <span className="text-slate-700">
                {zoneName} → {level}
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mt-4">
          <div className="text-sm font-semibold">Custom Message (Optional)</div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Example: Zone B overcrowded. Redirect to Gate 3. Entry paused for 5 minutes."
            className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white min-h-[110px]"
          />
        </div>

        <button
          onClick={sendCrowdAlert}
          disabled={sending}
          className="mt-5 px-6 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95 disabled:opacity-60"
        >
          {sending ? "Broadcasting..." : "Broadcast Crowd Alert"}
        </button>

        <div className="text-xs text-slate-600 mt-3">
          ✅ Pilgrims will receive this instantly in <b>Notifications</b> page.
        </div>
      </div>

      {/* ✅ Quick Templates */}
      <div className="mt-8">
        <div className="font-semibold mb-3">Quick Message Templates</div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() =>
              setMessage(
                `${zoneName} is overcrowded. Please move slowly and follow barricade guidance.`
              )
            }
            className="rounded-2xl border bg-white px-4 py-3 hover:bg-orange-50 text-left"
          >
            🚧 Overcrowded Slow Movement
          </button>

          <button
            onClick={() =>
              setMessage(
                `Entry temporarily paused at ${zoneName}. Please wait for security clearance.`
              )
            }
            className="rounded-2xl border bg-white px-4 py-3 hover:bg-orange-50 text-left"
          >
            ⛔ Entry Paused
          </button>

          <button
            onClick={() =>
              setMessage(
                `Please use alternate gate due to congestion at ${zoneName}.`
              )
            }
            className="rounded-2xl border bg-white px-4 py-3 hover:bg-orange-50 text-left"
          >
            🔁 Use Alternate Gate
          </button>

          <button
            onClick={() =>
              setMessage(
                `Medical assistance team is active near ${zoneName}. If you need help use SOS.`
              )
            }
            className="rounded-2xl border bg-white px-4 py-3 hover:bg-orange-50 text-left"
          >
            🏥 Medical Assistance Info
          </button>
        </div>
      </div>
    </div>
  );
}
