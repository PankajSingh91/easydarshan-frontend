import React, { useState } from "react";
import { api } from "../../config/api";

/* ----------------------------------------------------
   ALGORITHM HELPERS (UI CALENDAR + SLOT GENERATOR)
---------------------------------------------------- */

const QUEUE_TYPES = ["Free", "Seeghra", "Atiseeghra"];

// ✅ Consistent backend date format: YYYY-MM-DD
function getDateKey(dateObj) {
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

// ✅ Queue-aware date status algorithm (UI-only colors)
function getDateStatus(date, queue) {
  const seed = date.getDate() + queue.length;
  if (seed % 7 === 0) return "red";
  if (seed % 5 === 0) return "orange";
  return "green";
}

// ✅ Slot generator per date + queue (UI-only seats)
// (Backend will still validate real slot capacity)
function getSlotsForDate(date, queue) {
  const baseSlots = [
    "06:00 - 06:30",
    "06:30 - 07:00",
    "11:00 - 11:30",
    "11:30 - 12:00",
    "17:00 - 17:30",
  ];

  return baseSlots.map((time, i) => ({
    time,
    seats:
      queue === "Atiseeghra"
        ? Math.max(0, 10 - i)
        : queue === "Seeghra"
        ? Math.max(0, 25 - i * 2)
        : Math.max(0, 40 - i * 3),
  }));
}

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */

export default function BookSlot() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    persons: 1,

    queueType: "Free",
    date: "",
    slot: "",

    idType: "Aadhaar",
    idNumber: "",
    idProofFile: null,

    priority: false,
    priorityType: "Elderly",
    proofType: "",
    proofNumber: "",
    proofFile: null,
    otherCase: "",
  });

  const [showCalendar, setShowCalendar] = useState(false);

  // ✅ If priority enabled, treat as Seeghra for selection UI
  const effectiveQueue = form.priority ? "Seeghra" : form.queueType;
  const isOtherSelected = form.priority && form.priorityType === "Other";

  const slots =
    form.date ? getSlotsForDate(new Date(form.date), effectiveQueue) : [];

  // ✅ BOOK TICKET (Backend Connected)
  const handleSubmit = async () => {
    try {
      if (!form.name || !form.phone || !form.date || !form.slot) {
        alert("Please fill all required booking fields.");
        return;
      }

      if (!form.idNumber || !form.idProofFile) {
        alert("Please upload ID proof and enter ID number.");
        return;
      }

      if (form.priority) {
        if (!form.priorityType || !form.proofType || !form.proofNumber) {
          alert("Priority proof details are mandatory.");
          return;
        }

        if (!form.proofFile) {
          alert("Priority proof document is mandatory.");
          return;
        }

        if (form.priorityType === "Other" && (!form.otherCase || form.otherCase.trim() === "")) {
          alert("Please specify your priority case in 'Other'.");
          return;
        }
      }

      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("phone", form.phone);
      fd.append("date", form.date);
      fd.append("slotTime", form.slot);
      fd.append("idType", form.idType);
      fd.append("idNumber", form.idNumber);

      fd.append("priorityEnabled", form.priority);

      // ✅ Mandatory ID proof for all bookings
      fd.append("idProofFile", form.idProofFile);

      // ✅ Priority booking
      if (form.priority) {
        fd.append("priorityType", form.priorityType);
        fd.append("proofType", form.proofType);
        fd.append("proofNumber", form.proofNumber);
        fd.append("otherCase", form.otherCase || "");

        if (form.proofFile) {
          fd.append("priorityProofFile", form.proofFile);
        }
      }

      const res = await api.post("/api/tickets/book", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`✅ Ticket Booked!\nTicket ID: ${res.data.ticket.ticketId}`);

      // Redirect to ticket page
      window.location.href = "/pilgrim/ticket";
    } catch (err) {
      alert(err?.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Book Darshan Slot</h2>

      {/* ---------------- DARSHAN TYPE ---------------- */}
      <div className="mt-6">
        <Select
          label="Darshan Type *"
          value={form.queueType}
          onChange={(v) => setForm({ ...form, queueType: v, date: "", slot: "" })}
          options={QUEUE_TYPES}
        />
        <div className="text-xs text-slate-600 mt-1">
          Free: ~60 mins | Seeghra: ~25 mins | Atiseeghra: ~10 mins
        </div>
      </div>

      {/* ---------------- DATE SELECTION ---------------- */}
      <div className="mt-6 relative">
        <div className="text-sm font-semibold">Select Date *</div>
        <input
          readOnly
          value={form.date}
          placeholder="YYYY-MM-DD"
          onClick={() => setShowCalendar(!showCalendar)}
          className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white cursor-pointer"
        />

        {showCalendar && (
          <div className="absolute z-30 mt-2">
            <Calendar
              queue={effectiveQueue}
              selectedDate={form.date}
              onSelect={(d) => {
                setForm({ ...form, date: d, slot: "" });
                setShowCalendar(false);
              }}
            />
          </div>
        )}
      </div>

      {/* ---------------- SLOT SELECTION ---------------- */}
      {form.date && (
        <div className="mt-6">
          <div className="text-sm font-semibold">Slot Time *</div>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            {slots.map((s) => (
              <button
                key={s.time}
                disabled={s.seats <= 0}
                onClick={() => setForm({ ...form, slot: s.time })}
                className={`p-4 rounded-2xl border flex justify-between items-center transition
                  ${form.slot === s.time ? "ring-2 ring-brand-600" : ""}
                  ${s.seats <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-50"}`}
              >
                <div>
                  <div className="text-lg font-bold">{s.seats}</div>
                  <div className="text-xs">Available</div>
                </div>
                <div className="font-medium">{s.time}</div>
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 mt-2">
            *Final availability will be validated by the backend slot capacity.
          </div>
        </div>
      )}

      {/* ---------------- BOOKING DETAILS ---------------- */}
      <div className="mt-8 border-t pt-6">
        <div className="font-semibold mb-4">Booking Details</div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Input
            label="Mobile Number *"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />

          <Input
            label="Date of Birth *"
            type="date"
            value={form.dob}
            onChange={(v) => setForm({ ...form, dob: v })}
          />

          <Select
            label="Gender *"
            value={form.gender}
            onChange={(v) => setForm({ ...form, gender: v })}
            options={["Male", "Female", "Other"]}
          />

          <Select
            label="Number of Persons *"
            value={form.persons}
            onChange={(v) => setForm({ ...form, persons: v })}
            options={[1, 2, 3, 4, 5]}
          />
        </div>
      </div>

      {/* ---------------- ID DETAILS ---------------- */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Select
          label="ID Type *"
          value={form.idType}
          onChange={(v) => setForm({ ...form, idType: v })}
          options={["Aadhaar", "PAN", "Voter ID", "Passport"]}
        />

        <Input
          label="ID Number *"
          value={form.idNumber}
          onChange={(v) => setForm({ ...form, idNumber: v })}
        />

        <div className="md:col-span-2">
          <FileUpload
            label="Upload ID Proof Document *"
            subText="Allowed: JPG, PNG, PDF"
            onChange={(f) => setForm({ ...form, idProofFile: f })}
            selectedFile={form.idProofFile}
          />
        </div>
      </div>

      {/* ---------------- PRIORITY ACCESS ---------------- */}
      <div className="mt-6 rounded-3xl border bg-orange-50 p-5">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.checked })}
          />
          Enable Priority Access
        </label>

        {form.priority && (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <Select
              label="Priority Type *"
              value={form.priorityType}
              onChange={(v) => setForm({ ...form, priorityType: v })}
              options={[
                "Elderly",
                "Differently-Abled",
                "Pregnant",
                "Women with Children",
                "Other",
              ]}
            />

            <Select
              label="Proof Type *"
              value={form.proofType}
              onChange={(v) => setForm({ ...form, proofType: v })}
              options={[
                "Govt ID / Age Proof",
                "Disability Certificate",
                "Medical Certificate",
                "Pregnancy Report",
                "Other",
              ]}
            />

            <Input
              label="Proof Number / Reference ID *"
              value={form.proofNumber}
              onChange={(v) => setForm({ ...form, proofNumber: v })}
            />

            <FileUpload
              label="Upload Priority Proof *"
              subText="Allowed: JPG, PNG, PDF"
              onChange={(f) => setForm({ ...form, proofFile: f })}
              selectedFile={form.proofFile}
            />

            {isOtherSelected && (
              <TextArea
                label="Specify Other Case *"
                value={form.otherCase}
                onChange={(v) => setForm({ ...form, otherCase: v })}
              />
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95"
      >
        Confirm Booking
      </button>
    </div>
  );
}

/* ----------------------------------------------------
   CALENDAR COMPONENT (MONTH VIEW, 120 DAYS)
---------------------------------------------------- */

function Calendar({ queue, selectedDate, onSelect }) {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 120);

  const [view, setView] = useState(new Date());

  const start = new Date(view.getFullYear(), view.getMonth(), 1);
  const end = new Date(view.getFullYear(), view.getMonth() + 1, 0);

  const days = [];
  for (let i = 0; i < start.getDay(); i++) days.push(null);
  for (let d = 1; d <= end.getDate(); d++) {
    days.push(new Date(view.getFullYear(), view.getMonth(), d));
  }

  const colorClass = (date) => {
    if (date < today) return "bg-gray-200 text-gray-400 cursor-not-allowed";
    if (date > maxDate) return "hidden";

    const status = getDateStatus(date, queue);
    if (status === "red") return "bg-red-700 text-white";
    if (status === "orange") return "bg-orange-400 text-white";
    return "bg-green-500 text-white";
  };

  const moveMonth = (dir) => {
    const newView = new Date(view);
    newView.setMonth(view.getMonth() + dir);
    setView(newView);
  };

  return (
    <div className="bg-white border rounded-2xl p-4 w-fit shadow-lg">
      <div className="flex justify-between items-center mb-3 font-semibold">
        <button onClick={() => moveMonth(-1)}>‹</button>
        {view.toLocaleString("default", { month: "long", year: "numeric" })}
        <button onClick={() => moveMonth(1)}>›</button>
      </div>

      <div className="grid grid-cols-7 text-xs text-center mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) =>
          d ? (
            <button
              key={i}
              disabled={d < today || d > maxDate}
              onClick={() => onSelect(getDateKey(d))}
              className={`h-9 w-9 rounded-md text-sm font-semibold transition
                ${colorClass(d)}
                ${selectedDate === getDateKey(d) ? "ring-2 ring-black" : ""}`}
            >
              {d.getDate()}
            </button>
          ) : (
            <div key={i} />
          )
        )}
      </div>

      <div className="mt-3 text-xs text-slate-600">
        <div className="flex gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-green-500"></span> Available
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-orange-400"></span> Limited
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-red-700"></span> Full
          </span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   UI COMPONENTS
---------------------------------------------------- */

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-2xl border"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
      >
        <option value="">Select</option>
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileUpload({ label, subText, onChange, selectedFile }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <input
        type="file"
        accept=".jpg,.png,.pdf"
        onChange={(e) => onChange(e.target.files[0])}
        className="mt-2 w-full"
      />
      <div className="text-xs text-slate-500 mt-1">{subText}</div>
      {selectedFile && <div className="text-xs mt-1">{selectedFile.name}</div>}
    </div>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <div className="md:col-span-2">
      <div className="text-sm font-semibold">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-2xl border min-h-[110px]"
      />
    </div>
  );
}
