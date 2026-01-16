import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScan() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        setResult(decodedText);

        // ✅ Mock verification (backend later)
        if (decodedText.includes("ED-")) {
          setStatus("✅ Ticket Verified Successfully (UI Only)");
        } else {
          setStatus("❌ Invalid QR / Ticket");
        }

        scanner.clear().catch(() => {});
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="bg-white border rounded-3xl shadow-soft p-6">
      <h2 className="text-2xl font-extrabold">QR Gate Verification</h2>
      <p className="text-slate-600 mt-1">
        Scan the pilgrim QR ticket to verify entry/exit.
      </p>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border bg-orange-50 p-4">
          <div className="font-semibold mb-3">Scanner</div>
          <div id="qr-reader" className="rounded-2xl overflow-hidden"></div>
        </div>

        <div className="rounded-3xl border p-5">
          <div className="text-sm text-slate-500">Scan Result</div>
          <div className="mt-2 font-mono font-bold text-lg break-words">
            {result || "Waiting for scan..."}
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-orange-50 border">
            <div className="font-semibold">Verification Status</div>
            <div className="mt-1 text-sm">{status || "Not verified yet"}</div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-4 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95"
          >
            Scan Another Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
