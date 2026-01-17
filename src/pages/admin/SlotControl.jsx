import React, { useState } from "react";
import { api } from "../../config/api"; // ✅ NEW

const DARSHAN_TYPES = ["General", "Seeghra"];

export default function SlotControl() {
  const [mandatory, setMandatory] = useState(true);

  const [darshanType, setDarshanType] = useState("General");
  const [date, setDate] = useState("");

  const [slots, setSlots] = useState([
    {
      startTime: "06:00",
      endTime: "06:30",
      time: "06:00 - 06:30",
      generalCap: 200,
      priorityCap: 50,
      otherCap: 0,
    },
  ]);

  const updateSlot = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;

    // ✅ Auto-generate readable slot time
    if (field === "startTime" || field === "endTime") {
      const { startTime, endTime } = updated[index];
      if (startTime && endTime) {
        updated[index].time = `${startTime} - ${endTime}`;
      }
    }

    setSlots(updated);
  };

  const addSlot = () => {
    setSlots([
      ...slots,
      {
        startTime: "",
        endTime: "",
        time: "",
        generalCap: 0,
        priorityCap: 0,
        otherCap: 0,
      },
    ]);
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  // ✅ NEW: SAVE TO BACKEND
  const handleSave = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    try {
      for (const slot of slots) {
        if (!slot.time) continue;

        await api.post("/api/slots/create", {
          date,
          timeRange: slot.time,
          darshanType: darshanType.toUpperCase(), // GENERAL / SEEGHRA
          normalCapacity: Number(slot.generalCap),
          priorityCapacity: Number(slot.priorityCap),
          otherCapacity: Number(slot.otherCap),
        });
      }

      alert("✅ Slots saved successfully");
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Failed to save slot configuration"
      );
    }
  };

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Slot Control & Enforcement</h2>
      <p className="text-slate-600 mt-1">
        Create and manage darshan slots by type, date, and queue category.
      </p>

      {/* ---------------- MANDATORY BOOKING ---------------- */}
      <div className="mt-6 rounded-3xl border bg-orange-50 p-6">
        <div className="font-semibold">Mandatory Booking Mode</div>
        <p className="text-sm text-slate-600 mt-1">
          When enabled, only booked pilgrims can enter during crowd surges.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={mandatory}
            onChange={(e) => setMandatory(e.target.checked)}
            className="h-5 w-5"
          />
          <span className="font-semibold">
            {mandatory ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {/* ---------------- DARSHAN TYPE + DATE ---------------- */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-semibold">Darshan Type *</div>
          <select
            value={darshanType}
            onChange={(e) => setDarshanType(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
          >
            {DARSHAN_TYPES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-500 mt-1">
            {darshanType === "Seeghra"
              ? "Paid fast-track darshan (₹300)"
              : "Regular darshan"}
          </div>
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
      </div>

      {/* ---------------- SLOT CONFIGURATION ---------------- */}
      <div className="mt-8">
        <div className="font-semibold text-lg">
          {darshanType} Gate Slot Configuration
        </div>

        <div className="mt-4 space-y-4">
          {slots.map((slot, i) => (
            <div
              key={i}
              className="rounded-3xl border p-4 grid md:grid-cols-7 gap-3 bg-orange-50"
            >
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) =>
                  updateSlot(i, "startTime", e.target.value)
                }
                className="px-3 py-2 rounded-xl border"
              />

              <input
                type="time"
                value={slot.endTime}
                onChange={(e) =>
                  updateSlot(i, "endTime", e.target.value)
                }
                className="px-3 py-2 rounded-xl border"
              />

              <input
                type="text"
                value={slot.time}
                readOnly
                className="px-3 py-2 rounded-xl border bg-gray-100"
              />

              <input
                type="number"
                value={slot.generalCap}
                onChange={(e) =>
                  updateSlot(i, "generalCap", e.target.value)
                }
                className="px-3 py-2 rounded-xl border"
              />

              <input
                type="number"
                value={slot.priorityCap}
                onChange={(e) =>
                  updateSlot(i, "priorityCap", e.target.value)
                }
                className="px-3 py-2 rounded-xl border"
              />

              <input
                type="number"
                value={slot.otherCap}
                onChange={(e) =>
                  updateSlot(i, "otherCap", e.target.value)
                }
                className="px-3 py-2 rounded-xl border"
              />

              <button
                onClick={() => removeSlot(i)}
                className="px-3 py-2 rounded-xl border text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addSlot}
          className="mt-4 px-4 py-2 rounded-2xl border bg-white"
        >
          + Add Slot
        </button>
      </div>

      {/* ---------------- SAVE ---------------- */}
      <button
        onClick={handleSave} // ✅ CONNECTED
        className="mt-8 px-6 py-3 rounded-2xl bg-brand-600 text-white font-semibold"
      >
        Save Slot Configuration
      </button>
    </div>
  );
}