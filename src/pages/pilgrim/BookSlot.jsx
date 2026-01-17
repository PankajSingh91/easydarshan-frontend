import React, { useState } from "react";
import { api } from "../../config/api";

export default function BookSlot() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    slot: "",

    // Normal ID
    idType: "Aadhaar",
    idNumber: "",
    idProofFile: null, // ✅ NEW: upload for normal bookings

    // Priority Access
    priority: false,
    priorityType: "Elderly",

    // Priority Proof
    proofType: "",
    proofNumber: "",
    proofFile: null,

    // Other case
    otherCase: "",
  });

  const isOtherSelected = form.priority && form.priorityType === "Other";

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

    // Optionally redirect to ticket page
    window.location.href = "/pilgrim/ticket";
  } catch (err) {
    alert(err?.response?.data?.message || "Booking failed");
  }
};

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Book Darshan Slot</h2>
      <p className="text-slate-600 mt-1">
        Mandatory pre-enrollment with slot-based booking during peak hours.
      </p>

      {/* Booking Form */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
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
          label="Date *"
          type="date"
          value={form.date}
          onChange={(v) => setForm({ ...form, date: v })}
        />

        <Select
          label="Slot Time *"
          value={form.slot}
          onChange={(v) => setForm({ ...form, slot: v })}
          options={[
            "06:00 - 06:30",
            "06:30 - 07:00",
            "11:00 - 11:30",
            "11:30 - 12:00",
            "17:00 - 17:30",
          ]}
        />

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

        {/* ✅ NEW ID Proof Upload */}
        <div className="md:col-span-2">
          <FileUpload
            label="Upload ID Proof Document *"
            subText="Required for all bookings. Allowed: JPG, PNG, PDF"
            onChange={(file) => setForm({ ...form, idProofFile: file })}
            selectedFile={form.idProofFile}
          />
        </div>
      </div>

      {/* Priority Access Block */}
      <div className="mt-6 rounded-3xl border bg-orange-50 p-5">
        <div className="font-semibold">Priority Access (Optional)</div>
        <p className="text-sm text-slate-600 mt-1">
          Available for Elderly, Differently-Abled, Women with Children, Pregnant and special cases.
          Proof is mandatory for verification.
        </p>

        <div className="mt-3 flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.checked,

                // reset priority proof when disabled
                priorityType: e.target.checked ? form.priorityType : "Elderly",
                proofType: e.target.checked ? form.proofType : "",
                proofNumber: e.target.checked ? form.proofNumber : "",
                proofFile: e.target.checked ? form.proofFile : null,
                otherCase: e.target.checked ? form.otherCase : "",
              })
            }
            className="h-5 w-5"
          />
          <span className="text-sm font-medium">Enable Priority Access</span>
        </div>

        {form.priority && (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <Select
              label="Priority Type *"
              value={form.priorityType}
              onChange={(v) =>
                setForm({
                  ...form,
                  priorityType: v,
                  otherCase: v === "Other" ? form.otherCase : "",
                })
              }
              options={[
                "Elderly",
                "Differently-Abled",
                "Women with Children",
                "Pregnant",
                "Other",
              ]}
            />

            <Select
              label="Proof Type *"
              value={form.proofType}
              onChange={(v) => setForm({ ...form, proofType: v })}
              options={[
                "Government ID / Age Proof",
                "Disability Certificate",
                "Hospital / Medical Certificate",
                "Pregnancy Report / Doctor Note",
                "Other Supporting Document",
              ]}
            />

            <Input
              label="Proof Number / Reference ID *"
              value={form.proofNumber}
              onChange={(v) => setForm({ ...form, proofNumber: v })}
              placeholder="Eg: CERT-2026-0091"
            />

            <FileUpload
              label="Upload Priority Proof Document *"
              subText="Required only for priority booking. Allowed: JPG, PNG, PDF"
              onChange={(file) => setForm({ ...form, proofFile: file })}
              selectedFile={form.proofFile}
            />

            {isOtherSelected && (
              <div className="md:col-span-2">
                <TextArea
                  label="Specify your case (Other) *"
                  value={form.otherCase}
                  onChange={(v) => setForm({ ...form, otherCase: v })}
                  placeholder="Example: Temporary injury, special assistance required..."
                />
              </div>
            )}

            <div className="md:col-span-2 text-xs text-slate-600 mt-1">
              ✅ Note: Priority access will be confirmed after verification at gate/admin panel.
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95"
      >
        Confirm Booking
      </button>
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
        placeholder={placeholder || `Enter ${label.replace("*", "").trim()}`}
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
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
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
      <div className="mt-2 w-full rounded-2xl border bg-white p-3">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
        <div className="text-xs text-slate-500 mt-2">{subText}</div>
        {selectedFile && (
          <div className="text-xs mt-2">
            ✅ Selected:{" "}
            <span className="font-semibold">{selectedFile.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[110px]"
      />
    </div>
  );
}
