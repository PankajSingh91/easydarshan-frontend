import React, { useEffect, useState } from "react";
import { api } from "../../config/api";

/* ----------------------------------------------------
   CONFIG
---------------------------------------------------- */

const QUEUE_TYPES = ["General", "Seeghra"];

const PRIORITY_TYPES = [
  "Elderly",
  "Differently-Abled",
  "Pregnant",
  "Women with Children",
  "Other",
];

const PROOF_TYPES = [
  "Govt ID / Age Proof",
  "Disability Certificate",
  "Medical Certificate",
  "Pregnancy Report",
  "Other",
];

/* ----------------------------------------------------
   HELPERS
---------------------------------------------------- */

function getDateKey(dateObj) {
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeTimeRange(value) {
  if (!value) return "";
  return value.replace(/\s+/g, " ").replace(/\s*-\s*/g, " - ").trim();
}

function createEmptyPerson() {
  return {
    fullName: "",
    phone: "",
    dob: "",
    gender: "",
    idType: "Aadhaar",
    idNumber: "",
    idProofFile: null,

    priorityEnabled: false,
    priorityType: "Elderly",
    proofType: "",
    proofNumber: "",
    priorityProofFile: null,
    otherCase: "",
  };
}

/* ----------------------------------------------------
   MAIN
---------------------------------------------------- */

export default function BookSlot() {
  const [booking, setBooking] = useState({
    queueType: "General",
    date: "",
    slot: "",
    persons: 1,

    priorityEnabled: false,
    priorityCount: 1,
    companionCount: 0,
  });

  const [pilgrims, setPilgrims] = useState([createEmptyPerson()]);
  const [showCalendar, setShowCalendar] = useState(false);

  // ✅ Backend slots
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [backendSlots, setBackendSlots] = useState([]);
  const [slotError, setSlotError] = useState("");

  // ✅ Calendar summary
  const [summaryMap, setSummaryMap] = useState({});
  const [loadingSummary, setLoadingSummary] = useState(false);

  // ✅ UI submit
  const [submitting, setSubmitting] = useState(false);

  const totalPersons = Number(booking.persons);
  const priorityCount = booking.priorityEnabled ? Number(booking.priorityCount) : 0;

  const maxCompanionAllowed = booking.priorityEnabled
    ? Math.min(priorityCount, totalPersons - priorityCount)
    : 0;

  const remainingNormalPeople = totalPersons - priorityCount;

  const darshanTypeForBackend = booking.queueType === "Seeghra" ? "SEEGHRA" : "GENERAL";

  /* ----------------------------------------------------
     Resize persons
  ---------------------------------------------------- */
  useEffect(() => {
    const count = Number(booking.persons);

    setPilgrims((prev) => {
      const copy = [...prev];

      if (copy.length < count) {
        while (copy.length < count) copy.push(createEmptyPerson());
      } else if (copy.length > count) {
        copy.length = count;
      }

      return copy;
    });

    setBooking((prev) => {
      const newPriorityCount = Math.min(prev.priorityCount || 1, count);
      const maxCompanion = prev.priorityEnabled
        ? Math.min(newPriorityCount, count - newPriorityCount)
        : 0;

      return {
        ...prev,
        priorityCount: newPriorityCount,
        companionCount: Math.min(prev.companionCount || 0, maxCompanion),
      };
    });
  }, [booking.persons]);

  /* ----------------------------------------------------
     Priority enable/disable bounds
  ---------------------------------------------------- */
  useEffect(() => {
    setBooking((prev) => {
      if (!prev.priorityEnabled) return { ...prev, priorityCount: 1, companionCount: 0 };

      const pCount = Math.min(prev.priorityCount || 1, prev.persons);
      const maxCompanion = Math.min(pCount, prev.persons - pCount);

      return {
        ...prev,
        priorityCount: pCount,
        companionCount: Math.min(prev.companionCount || 0, maxCompanion),
      };
    });
  }, [booking.priorityEnabled]);

  /* ----------------------------------------------------
     Mark first N persons as priority automatically
  ---------------------------------------------------- */
  useEffect(() => {
    setPilgrims((prev) =>
      prev.map((p, idx) => {
        const shouldBePriority = booking.priorityEnabled && idx < Number(booking.priorityCount);
        return { ...p, priorityEnabled: shouldBePriority };
      })
    );
  }, [booking.priorityEnabled, booking.priorityCount]);

  /* ----------------------------------------------------
     Backend Fetch Helpers
  ---------------------------------------------------- */

  const fetchCalendarSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await api.get(`/api/slots/calendar-summary?darshanType=${darshanTypeForBackend}`);

      const map = {};
      (res.data?.summary || []).forEach((d) => {
        map[d.date] = d;
      });

      setSummaryMap(map);
    } catch (err) {
      console.log("Calendar summary error:", err?.response?.data?.message || err.message);
      setSummaryMap({});
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchSlotsForDate = async () => {
    try {
      setSlotError("");
      setBackendSlots([]);

      if (!booking.date) return;

      setLoadingSlots(true);

      const res = await api.get(
        `/api/slots/by-date?date=${booking.date}&darshanType=${darshanTypeForBackend}`
      );

      const list = (res.data?.slots || []).map((s) => {
        const totalCap =
          Number(s.normalCapacity || 0) +
          Number(s.priorityCapacity || 0) +
          Number(s.otherCapacity || 0);

        const remaining = Math.max(0, totalCap - Number(s.bookedCount || 0));

        return {
          _id: s._id,
          time: normalizeTimeRange(s.timeRange),
          seats: remaining,
          totalCapacity: totalCap,
          bookedCount: Number(s.bookedCount || 0),
          raw: s,
        };
      });

      setBackendSlots(list);

      const selectedExists = list.some((x) => x.time === normalizeTimeRange(booking.slot));
      if (!selectedExists) {
        setBooking((prev) => ({ ...prev, slot: "" }));
      }
    } catch (err) {
      setSlotError(err?.response?.data?.message || "Failed to load slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  /* ----------------------------------------------------
     Initial + On Type Change
  ---------------------------------------------------- */
  useEffect(() => {
    fetchCalendarSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.queueType]);

  /* ----------------------------------------------------
     On Date Change
  ---------------------------------------------------- */
  useEffect(() => {
    fetchSlotsForDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.date, booking.queueType]);

  /* ----------------------------------------------------
     Auto refresh (every 10 sec)
  ---------------------------------------------------- */
  useEffect(() => {
    if (!showCalendar && !booking.date) return;

    const interval = setInterval(async () => {
      await fetchCalendarSummary();
      await fetchSlotsForDate();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCalendar, booking.date, booking.queueType]);

  const updatePilgrim = (index, patch) => {
    setPilgrims((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  };

  /* ----------------------------------------------------
     ✅ MULTI PERSON SUBMIT
  ---------------------------------------------------- */
  const handleSubmit = async () => {
    try {
      if (submitting) return;

      if (!booking.date || !booking.slot) {
        alert("Please select date and slot.");
        return;
      }

      // ✅ Validate everyone
      for (let i = 0; i < pilgrims.length; i++) {
        const p = pilgrims[i];

        if (!p.fullName || !p.phone || !p.dob || !p.gender) {
          alert(`Please fill all required details for Person ${i + 1}`);
          return;
        }

        if (!p.idType || !p.idNumber || !p.idProofFile) {
          alert(`ID Proof is mandatory for Person ${i + 1}`);
          return;
        }

        if (p.priorityEnabled) {
          if (!p.priorityType || !p.proofType || !p.proofNumber) {
            alert(`Priority proof details are mandatory for Person ${i + 1}`);
            return;
          }

          if (!p.priorityProofFile) {
            alert(`Priority proof document is mandatory for Person ${i + 1}`);
            return;
          }

          if (p.priorityType === "Other" && (!p.otherCase || p.otherCase.trim() === "")) {
            alert(`Other case is required for Person ${i + 1}`);
            return;
          }
        }
      }

      setSubmitting(true);

      // ✅ Prepare payload
      const personsCount = pilgrims.length;

      const fd = new FormData();
      fd.append("darshanType", darshanTypeForBackend);
      fd.append("date", booking.date);
      fd.append("slotTime", normalizeTimeRange(booking.slot));
      fd.append("personsCount", String(personsCount));

      // ✅ pilgrim array without files (files will be appended separately)
      const pilgrimPayload = pilgrims.map((p) => ({
        fullName: p.fullName,
        phone: p.phone,
        dob: p.dob,
        gender: p.gender,

        idType: p.idType,
        idNumber: p.idNumber,

        priorityEnabled: Boolean(p.priorityEnabled),
        priorityType: p.priorityEnabled ? p.priorityType : "",
        proofType: p.priorityEnabled ? p.proofType : "",
        proofNumber: p.priorityEnabled ? p.proofNumber : "",
        otherCase: p.priorityEnabled ? p.otherCase || "" : "",
      }));

      fd.append("pilgrims", JSON.stringify(pilgrimPayload));

      // ✅ Append ID proofs in same order as pilgrims array
      pilgrims.forEach((p) => {
        fd.append("idProofFiles", p.idProofFile);
      });

      // ✅ Append priority proofs only for priority persons (order matters)
      pilgrims.forEach((p) => {
        if (p.priorityEnabled) {
          fd.append("priorityProofFiles", p.priorityProofFile);
        }
      });

      const res = await api.post("/api/tickets/book", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const ticketId = res.data?.ticket?.ticketId;

      alert(`✅ Ticket Booked Successfully!\nTicket ID: ${ticketId}`);

      // ✅ Refresh slots + calendar instantly
      await fetchCalendarSummary();
      await fetchSlotsForDate();

      // ✅ Redirect to ticket details page
      window.location.href = `/pilgrim/ticket/${ticketId}`;
    } catch (err) {
      alert(err?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Book Darshan Slot</h2>

      {/* ---------------- DARSHAN TYPE + PERSONS ---------------- */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Select
          label="Darshan Type *"
          value={booking.queueType}
          onChange={(v) =>
            setBooking({
              ...booking,
              queueType: v,
              slot: "",
              date: "",
            })
          }
          options={QUEUE_TYPES}
        />

        <Select
          label="Number of Persons * (Max 5)"
          value={booking.persons}
          onChange={(v) => setBooking({ ...booking, persons: Number(v) })}
          options={[1, 2, 3, 4, 5]}
        />
      </div>

      {/* ---------------- PRIORITY CONTROL ---------------- */}
      <div className="mt-6 rounded-3xl border bg-orange-50 p-5">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={booking.priorityEnabled}
            onChange={(e) => setBooking({ ...booking, priorityEnabled: e.target.checked })}
          />
          Enable Priority Access (for selected persons)
        </label>

        {booking.priorityEnabled && (
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <Select
              label="How many people need Priority? *"
              value={booking.priorityCount}
              onChange={(v) => setBooking({ ...booking, priorityCount: Number(v) })}
              options={Array.from({ length: totalPersons }, (_, i) => i + 1)}
            />

            <Select
              label="How many companions? (Optional)"
              value={booking.companionCount}
              onChange={(v) => setBooking({ ...booking, companionCount: Number(v) })}
              options={Array.from({ length: maxCompanionAllowed + 1 }, (_, i) => i)}
            />

            <div className="text-xs text-slate-700 bg-white rounded-2xl border p-4">
              <div className="font-semibold">Rule</div>
              <div className="mt-1">
                ✅ Each priority person can bring <b>1 normal companion</b> (optional)
              </div>
              <div className="mt-1">
                Remaining normal people: <b>{remainingNormalPeople}</b>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- DATE SELECTION ---------------- */}
      <div className="mt-6 relative">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Select Date *</div>
          <button
            onClick={() => fetchCalendarSummary()}
            className="text-xs px-3 py-1 rounded-xl border bg-white hover:bg-orange-50"
          >
            {loadingSummary ? "Refreshing..." : "Refresh Calendar"}
          </button>
        </div>

        <input
          readOnly
          value={booking.date}
          placeholder="YYYY-MM-DD"
          onClick={() => setShowCalendar(!showCalendar)}
          className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white cursor-pointer"
        />

        {showCalendar && (
          <div className="absolute z-30 mt-2">
            <Calendar
              selectedDate={booking.date}
              summaryMap={summaryMap}
              onSelect={(d) => {
                setBooking({ ...booking, date: d, slot: "" });
                setShowCalendar(false);
              }}
            />
          </div>
        )}
      </div>

      {/* ---------------- SLOT SELECTION ---------------- */}
      {booking.date && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Slot Time *</div>
            <button
              onClick={() => fetchSlotsForDate()}
              className="text-xs px-3 py-1 rounded-xl border bg-white hover:bg-orange-50"
            >
              {loadingSlots ? "Refreshing..." : "Refresh Slots"}
            </button>
          </div>

          {loadingSlots && <div className="mt-3 text-sm text-slate-600">Loading slots...</div>}
          {slotError && <div className="mt-3 text-sm text-red-600">{slotError}</div>}

          {!loadingSlots && !slotError && backendSlots.length === 0 && (
            <div className="mt-3 text-sm text-slate-600">
              No slots configured for this date & darshan type. Ask admin to create slots.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mt-2">
            {backendSlots.map((s) => (
              <button
                key={s._id}
                disabled={s.seats <= 0}
                onClick={() => setBooking({ ...booking, slot: s.time })}
                className={`p-4 rounded-2xl border flex justify-between items-center transition
                  ${normalizeTimeRange(booking.slot) === s.time ? "ring-2 ring-brand-600" : ""}
                  ${s.seats <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-50"}`}
              >
                <div>
                  <div className="text-lg font-bold">{s.seats}</div>
                  <div className="text-xs">Available</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Total: {s.totalCapacity} • Booked: {s.bookedCount}
                  </div>
                </div>
                <div className="font-medium">{s.time}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- PILGRIM DETAILS ---------------- */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-extrabold">Pilgrim Details</h3>
        <p className="text-sm text-slate-600 mt-1">
          Fill details for all selected persons. ID Proof required for each person.
        </p>

        <div className="mt-6 space-y-6">
          {pilgrims.map((p, idx) => (
            <div key={idx} className="rounded-3xl border p-5 bg-white">
              <div className="font-bold text-base">
                Person {idx + 1}{" "}
                {p.priorityEnabled ? (
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-orange-100 border">
                    Priority
                  </span>
                ) : (
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-slate-100 border">
                    Normal
                  </span>
                )}
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  value={p.fullName}
                  onChange={(v) => updatePilgrim(idx, { fullName: v })}
                />

                <Input
                  label="Mobile Number *"
                  value={p.phone}
                  onChange={(v) => updatePilgrim(idx, { phone: v })}
                />

                <Input
                  label="Date of Birth *"
                  type="date"
                  value={p.dob}
                  onChange={(v) => updatePilgrim(idx, { dob: v })}
                />

                <Select
                  label="Gender *"
                  value={p.gender}
                  onChange={(v) => updatePilgrim(idx, { gender: v })}
                  options={["Male", "Female", "Other"]}
                />
              </div>

              {/* ID proof per person */}
              <div className="mt-5 grid md:grid-cols-2 gap-4">
                <Select
                  label="ID Type *"
                  value={p.idType}
                  onChange={(v) => updatePilgrim(idx, { idType: v })}
                  options={["Aadhaar", "PAN", "Voter ID", "Passport"]}
                />

                <Input
                  label="ID Number *"
                  value={p.idNumber}
                  onChange={(v) => updatePilgrim(idx, { idNumber: v })}
                />

                <div className="md:col-span-2">
                  <FileUpload
                    label="Upload ID Proof Document *"
                    subText="Allowed: JPG, PNG, PDF"
                    onChange={(f) => updatePilgrim(idx, { idProofFile: f })}
                    selectedFile={p.idProofFile}
                  />
                </div>
              </div>

              {/* Priority proof */}
              {p.priorityEnabled && (
                <div className="mt-6 rounded-3xl border bg-orange-50 p-5">
                  <div className="font-semibold mb-3">Priority Verification</div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Select
                      label="Priority Type *"
                      value={p.priorityType}
                      onChange={(v) => updatePilgrim(idx, { priorityType: v })}
                      options={PRIORITY_TYPES}
                    />

                    <Select
                      label="Proof Type *"
                      value={p.proofType}
                      onChange={(v) => updatePilgrim(idx, { proofType: v })}
                      options={PROOF_TYPES}
                    />

                    <Input
                      label="Proof Number / Reference ID *"
                      value={p.proofNumber}
                      onChange={(v) => updatePilgrim(idx, { proofNumber: v })}
                    />

                    <FileUpload
                      label="Upload Priority Proof *"
                      subText="Allowed: JPG, PNG, PDF"
                      onChange={(f) => updatePilgrim(idx, { priorityProofFile: f })}
                      selectedFile={p.priorityProofFile}
                    />

                    {p.priorityType === "Other" && (
                      <TextArea
                        label="Specify Other Case *"
                        value={p.otherCase}
                        onChange={(v) => updatePilgrim(idx, { otherCase: v })}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`mt-6 px-6 py-3 rounded-2xl font-semibold text-white ${
          submitting ? "bg-gray-400 cursor-not-allowed" : "bg-brand-600 hover:opacity-95"
        }`}
      >
        {submitting ? "Booking..." : "Confirm Booking"}
      </button>

      <div className="mt-4 text-xs text-slate-500">
        ✅ Ticket will be generated with QR and visible in My Tickets automatically.
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   CALENDAR COMPONENT (REAL COLOR)
---------------------------------------------------- */

function Calendar({ selectedDate, onSelect, summaryMap }) {
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

  const getColorClass = (date) => {
    if (date < today) return "bg-gray-200 text-gray-400 cursor-not-allowed";
    if (date > maxDate) return "hidden";

    const key = getDateKey(date);
    const summary = summaryMap?.[key];

    if (!summary || Number(summary.totalCapacity || 0) <= 0) {
      return "bg-slate-100 text-slate-500 border hover:bg-slate-200 cursor-pointer";
    }

    const available = Number(summary.available || 0);
    const ratio = Number(summary.ratioAvailable || 0);

    if (available <= 0) return "bg-red-700 text-white";
    if (ratio > 0.5) return "bg-green-500 text-white";
    return "bg-orange-400 text-white";
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
                ${getColorClass(d)}
                ${selectedDate === getDateKey(d) ? "ring-2 ring-black" : ""}`}
              title={() => {
                const key = getDateKey(d);
                const s = summaryMap?.[key];
                if (!s) return "No slots configured";
                return `Available: ${s.available}/${s.totalCapacity}`;
              }}
            >
              {d.getDate()}
            </button>
          ) : (
            <div key={i} />
          )
        )}
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
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
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
        className="mt-2 w-full px-4 py-3 rounded-2xl border min-h-[110px] bg-white"
      />
    </div>
  );
}
