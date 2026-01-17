import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { api } from "../../config/api";

export default function QRScan() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [action, setAction] = useState("ENTRY");
  const [zoneName, setZoneName] = useState("Gate 2");
  const [gate, setGate] = useState("Gate Scanner 1");
  const [loading, setLoading] = useState(false);

  const verifyTicket = async (ticketId) => {
    try {
      setLoading(true);
      setStatus("⏳ Verifying ticket...");

      const res = await api.post("/api/verify/scan", {
        ticketId,
        action,
        zoneName,
        gate,
      });

      setStatus(`✅ Verified: ${res.data.ticket.ticketId} (${res.data.ticket.status})`);
    } catch (err) {
      setStatus(`❌ ${err?.response?.data?.message || "Verification failed"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        setResult(decodedText);
        await verifyTicket(decodedText);

        // stop after 1 scan
        scanner.clear().catch(() => {});
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, zoneName, gate]);

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">QR Gate Verification</h2>
      <p className="text-slate-600 mt-1">
        Scan pilgrim QR ticket to verify entry/exit and update zone crowd count.
      </p>

      {/* Controls */}
      <div className="mt-5 grid md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm font-semibold">Action</div>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
          >
            <option value="ENTRY">ENTRY</option>
            <option value="EXIT">EXIT</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-semibold">Zone</div>
          <select
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
          >
            <option>Gate 1</option>
            <option>Gate 2</option>
            <option>Queue Line</option>
            <option>Darshan Hall</option>
            <option>Exit</option>
            <option>Prasadam Area</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-semibold">Gate Scanner Name</div>
          <input
            value={gate}
            onChange={(e) => setGate(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-2xl border bg-white"
            placeholder="Gate Scanner 1"
          />
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <div className="rounded-3xl border bg-orange-50 p-4">
          <div className="font-semibold mb-3">Scanner</div>
          <div id="qr-reader" className="rounded-2xl overflow-hidden"></div>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95 w-full"
          >
            Scan Again
          </button>
        </div>

        {/* Result */}
        <div className="rounded-3xl border p-5">
          <div className="text-sm text-slate-500">Scanned Value</div>
          <div className="mt-2 font-mono font-bold text-lg break-words">
            {result || "Waiting for scan..."}
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-orange-50 border">
            <div className="font-semibold">Verification Status</div>
            <div className="mt-1 text-sm">
              {loading ? "⏳ Processing..." : status || "Not verified yet"}
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Note: ENTRY allowed only when ticket status is BOOKED. EXIT allowed
            only when ticket status is ENTERED.
          </div>
        </div>
      </div>
    </div>
  );
}
