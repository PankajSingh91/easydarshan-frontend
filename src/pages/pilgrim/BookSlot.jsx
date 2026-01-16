import React, { useState } from "react";

export default function BookSlot() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    slot: "",
    idType: "Aadhaar",
    idNumber: "",
    priority: false,
    priorityType: "Elderly",
  });

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">Book Darshan Slot</h2>
      <p className="text-slate-600 mt-1">
        Mandatory pre-enrollment with slot-based booking during peak hours.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Input label="Full Name" value={form.name} onChange={(v)=>setForm({...form,name:v})} />
        <Input label="Mobile Number" value={form.phone} onChange={(v)=>setForm({...form,phone:v})} />
        <Input label="Date" type="date" value={form.date} onChange={(v)=>setForm({...form,date:v})} />
        <Select
          label="Slot Time"
          value={form.slot}
          onChange={(v)=>setForm({...form,slot:v})}
          options={["06:00 - 06:30", "06:30 - 07:00", "11:00 - 11:30", "11:30 - 12:00", "17:00 - 17:30"]}
        />

        <Select
          label="ID Type"
          value={form.idType}
          onChange={(v)=>setForm({...form,idType:v})}
          options={["Aadhaar", "PAN", "Voter ID", "Passport"]}
        />
        <Input
          label="ID Number"
          value={form.idNumber}
          onChange={(v)=>setForm({...form,idNumber:v})}
        />
      </div>

      <div className="mt-5 rounded-3xl border bg-orange-50 p-5">
        <div className="font-semibold">Priority Access (Optional)</div>
        <p className="text-sm text-slate-600 mt-1">
          For elderly, differently-abled, and women with children.
        </p>

        <div className="mt-3 flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.priority}
            onChange={(e)=>setForm({...form,priority:e.target.checked})}
            className="h-5 w-5"
          />
          <span className="text-sm font-medium">Enable Priority Access</span>
        </div>

        {form.priority && (
          <div className="mt-3">
            <Select
              label="Priority Type"
              value={form.priorityType}
              onChange={(v)=>setForm({...form,priorityType:v})}
              options={["Elderly", "Differently-Abled", "Women with Children"]}
            />
          </div>
        )}
      </div>

      <button
        onClick={() => alert("UI Only ✅ Ticket will be generated in backend step")}
        className="mt-6 px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95"
      >
        Confirm Booking
      </button>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
        placeholder={`Enter ${label}`}
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
        onChange={(e)=>onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
      >
        <option value="">Select</option>
        {options.map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </div>
  );
}
