import React from "react";

export default function StatCard({ title, value, sub, icon: Icon }) {
  return (
    <div className="bg-white border rounded-3xl p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="text-2xl font-extrabold mt-1">{value}</div>
          {sub ? <div className="text-xs text-slate-500 mt-1">{sub}</div> : null}
        </div>

        {Icon ? (
          <div className="h-12 w-12 rounded-2xl bg-orange-50 border flex items-center justify-center">
            <Icon size={22} className="text-brand-700" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
