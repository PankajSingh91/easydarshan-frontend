import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  QrCode,
  BellRing,
  ShieldCheck,
  Siren,
  Activity,
  Clock,
  MapPin,
  Hospital,
  ShieldAlert,
  Info,
  ClipboardList,
} from "lucide-react";

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="bg-white border rounded-3xl p-6 shadow-soft hover:-translate-y-1 transition">
    <div className="h-12 w-12 rounded-2xl bg-orange-50 border flex items-center justify-center">
      <Icon className="text-brand-700" />
    </div>
    <div className="mt-4 font-bold">{title}</div>
    <div className="text-sm text-slate-600 mt-1">{desc}</div>
  </div>
);

function ServiceCard({ icon: Icon, title, desc, tag }) {
  return (
    <div className="rounded-3xl border bg-orange-50 p-6 hover:-translate-y-1 transition shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="h-12 w-12 rounded-2xl bg-white border flex items-center justify-center">
          <Icon className="text-brand-700" />
        </div>
        {tag ? (
          <div className="text-xs font-semibold px-3 py-1 rounded-2xl bg-white border">
            {tag}
          </div>
        ) : null}
      </div>

      <div className="mt-4 font-extrabold">{title}</div>
      <div className="text-sm text-slate-600 mt-2">{desc}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, title, value }) {
  return (
    <div className="flex items-start gap-3 rounded-3xl border bg-white p-5">
      <div className="h-11 w-11 rounded-2xl bg-orange-50 border flex items-center justify-center">
        <Icon className="text-brand-700" size={20} />
      </div>
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="font-bold mt-1">{value}</div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-brand-800 to-brand-900 text-white">
        <div className="container-max py-14 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl text-sm">
              🛕 Safe Darshan • Faster Entry • Live Crowd Control
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight">
              EasyDarshan <br /> Temple Crowd Management
            </h1>

            <p className="mt-4 text-white/90 text-base md:text-lg">
              Mandatory slot booking, QR verification, real-time crowd monitoring,
              priority access & SOS emergency response — designed to keep every
              devotee safe and informed.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/pilgrim/book-slot"
                className="px-5 py-3 rounded-2xl bg-white text-brand-800 font-semibold shadow-soft hover:opacity-95"
              >
                Book Darshan Slot
              </Link>
              <Link
                to="/announcements"
                className="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 font-semibold hover:bg-white/15"
              >
                View Live Alerts
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/80">
              <span className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">
                ✅ QR Gate Entry
              </span>
              <span className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">
                ✅ Priority Access
              </span>
              <span className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">
                ✅ Live Heatmaps
              </span>
              <span className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15">
                ✅ SOS Dispatch
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-white/10 border border-white/15 rounded-3xl p-6 shadow-soft"
          >
            <div className="font-semibold text-lg">Today’s Temple Status</div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-sm text-white/80">Crowd Level</div>
                <div className="text-2xl font-extrabold mt-1">MODERATE</div>
                <div className="text-xs text-white/70 mt-1">
                  Zone B slightly busy
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-sm text-white/80">Approx Wait Time</div>
                <div className="text-2xl font-extrabold mt-1">25–35 min</div>
                <div className="text-xs text-white/70 mt-1">
                  Based on entry counts
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-sm text-white/80">Next Available Slot</div>
                <div className="text-2xl font-extrabold mt-1">11:30 AM</div>
                <div className="text-xs text-white/70 mt-1">
                  Limited seats remaining
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-sm text-white/80">Emergency</div>
                <div className="text-2xl font-extrabold mt-1">ACTIVE</div>
                <div className="text-xs text-white/70 mt-1">
                  SOS help available 24×7
                </div>
              </div>
            </div>

            <div className="mt-5 text-xs text-white/75">
              Tip: If crowd is HIGH, only slot-ticket entry will be allowed.
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="container-max py-12">
        <div className="text-center">
          <div className="text-sm text-brand-700 font-semibold">
            Built for Pilgrims + Authorities
          </div>
          <h2 className="text-3xl font-extrabold mt-2">
            Everything needed for safe darshan
          </h2>
          <p className="text-slate-600 mt-2">
            From booking to entry enforcement to emergency response.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature
            icon={CalendarCheck}
            title="Slot Booking & Pre-enrollment"
            desc="Mandatory pre-booking during peak hours with capacity limits."
          />
          <Feature
            icon={QrCode}
            title="QR/ID Verification"
            desc="Fast gate verification and fraud-proof entry control."
          />
          <Feature
            icon={BellRing}
            title="Live Alerts & Notifications"
            desc="Entry reminders, delays, and zone crowd conditions."
          />
          <Feature
            icon={ShieldCheck}
            title="Priority Access"
            desc="Dedicated priority for elderly, differently-abled & women with children."
          />
          <Feature
            icon={Activity}
            title="Real-Time Crowd Monitoring"
            desc="Zone-wise density + entry/exit counts to prevent bottlenecks."
          />
          <Feature
            icon={Siren}
            title="Emergency SOS Dispatch"
            desc="Location-based SOS alerts to medical and security units."
          />
        </div>

        <div className="mt-10 flex justify-center gap-3 flex-wrap">
          <Link
            to="/admin"
            className="px-4 py-3 rounded-2xl bg-white border shadow-soft hover:bg-orange-50"
          >
            Open Temple Admin Dashboard
          </Link>
          <Link
            to="/security"
            className="px-4 py-3 rounded-2xl bg-white border shadow-soft hover:bg-orange-50"
          >
            Open Security Dashboard
          </Link>
          <Link
            to="/medical"
            className="px-4 py-3 rounded-2xl bg-white border shadow-soft hover:bg-orange-50"
          >
            Open Medical Dashboard
          </Link>
        </div>
      </div>

      {/* Darshan Services (Reference Website Inspired) */}
      <div className="container-max pb-14">
        <div className="bg-white border rounded-3xl shadow-soft p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-sm text-brand-700 font-semibold">
                Temple Services
              </div>
              <h3 className="text-2xl font-extrabold mt-1">Darshan & Facilities</h3>
              <p className="text-slate-600 mt-2">
                Inspired by temple portals like Srisailam — but upgraded with live crowd
                safety + real-time emergency response.
              </p>
            </div>

            <Link
              to="/pilgrim"
              className="px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold hover:opacity-95 w-fit"
            >
              Open Pilgrim Portal
            </Link>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <ServiceCard
              icon={Clock}
              tag="Timings"
              title="Darshan Timings"
              desc="Check recommended entry slots and avoid peak crowd rush."
            />
            <ServiceCard
              icon={ClipboardList}
              tag="Booking"
              title="Seva Booking (Slot-based)"
              desc="Book darshan slots digitally for smooth and controlled entry."
            />
            <ServiceCard
              icon={MapPin}
              tag="Navigation"
              title="Temple Zones & Entry Gates"
              desc="Get gate guidance based on zone crowd density and queue routing."
            />
          </div>
        </div>
      </div>

      {/* Guidelines + Support */}
      <div className="container-max pb-14">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border rounded-3xl shadow-soft p-8">
            <div className="text-sm text-brand-700 font-semibold">Guidelines</div>
            <h3 className="text-2xl font-extrabold mt-1">Crowd Safety Instructions</h3>
            <p className="text-slate-600 mt-2">
              Live enforcement helps prevent overcrowding and ensures safe darshan.
            </p>

            <div className="mt-6 grid gap-3">
              <InfoRow
                icon={Info}
                title="Mandatory Booking"
                value="Booking becomes mandatory automatically during peak crowd."
              />
              <InfoRow
                icon={ShieldAlert}
                title="Entry Control"
                value="Gate verification allows only valid QR tickets for slot entry."
              />
              <InfoRow
                icon={Hospital}
                title="Emergency Response"
                value="SOS sends location to nearest medical/security unit instantly."
              />
            </div>
          </div>

          <div className="bg-gradient-to-b from-brand-700 to-brand-900 text-white rounded-3xl shadow-soft p-8">
            <div className="text-sm text-white/80 font-semibold">Quick Access</div>
            <h3 className="text-2xl font-extrabold mt-1">
              Book faster • Enter smoother • Stay safer
            </h3>
            <p className="text-white/90 mt-2">
              EasyDarshan improves devotee experience and empowers temple staff with
              dashboards for crowd flow, heatmaps and emergency readiness.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/pilgrim/book-slot"
                className="px-5 py-3 rounded-2xl bg-white text-brand-800 font-semibold hover:opacity-95"
              >
                Book Slot
              </Link>
              <Link
                to="/pilgrim/ticket"
                className="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 font-semibold hover:bg-white/15"
              >
                View My Ticket
              </Link>
              <Link
                to="/pilgrim/sos"
                className="px-5 py-3 rounded-2xl bg-red-500/90 border border-white/10 font-semibold hover:opacity-95"
              >
                Emergency SOS
              </Link>
            </div>

            <div className="mt-6 text-xs text-white/75">
              ⚡ Hackathon MVP: UI now, real-time backend integration next step.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
