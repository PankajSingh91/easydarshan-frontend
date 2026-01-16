import React from "react";

export default function Contact() {
  return (
    <div className="container-max py-10">
      <div className="bg-white border rounded-3xl p-8 shadow-soft">
        <h1 className="text-3xl font-extrabold">Contact & Helpdesk</h1>
        <p className="text-slate-600 mt-2">
          Reach out for booking support, emergency help, or general queries.
        </p>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="rounded-3xl border p-6 bg-orange-50">
            <div className="font-semibold">General Support</div>
            <div className="text-sm text-slate-600 mt-2">+91-XXXXXXXXXX</div>
          </div>
          <div className="rounded-3xl border p-6 bg-orange-50">
            <div className="font-semibold">Emergency SOS</div>
            <div className="text-sm text-slate-600 mt-2">Dial 112</div>
          </div>
        </div>
      </div>
    </div>
  );
}
