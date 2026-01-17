import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import PortalLayout from "./layouts/PortalLayout";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Announcements from "./pages/public/Announcements";
import Contact from "./pages/public/Contact";

import PilgrimDashboard from "./pages/pilgrim/PilgrimDashboard";
import BookSlot from "./pages/pilgrim/BookSlot";
import MyTicket from "./pages/pilgrim/MyTicket";
import Notifications from "./pages/pilgrim/Notifications";
import SOS from "./pages/pilgrim/SOS";

import AdminDashboard from "./pages/admin/AdminDashboard";
import SlotControl from "./pages/admin/SlotControl";
import Reports from "./pages/admin/Reports";
import QRScan from "./pages/admin/QRScan";

import SecurityDashboard from "./pages/security/SecurityDashboard";
import Incidents from "./pages/security/Incidents";
import Deployment from "./pages/security/Deployment";

import MedicalDashboard from "./pages/medical/MedicalDashboard";
import Resources from "./pages/medical/Resources";
import EmergencyLog from "./pages/medical/EmergencyLog";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Pilgrim Portal */}
        <Route
  path="/pilgrim"
  element={
    <ProtectedRoute>
      <PortalLayout role="pilgrim" title="Pilgrim Portal" />
    </ProtectedRoute>
  }
>

          <Route index element={<PilgrimDashboard />} />
          <Route path="book-slot" element={<BookSlot />} />
          <Route path="ticket" element={<MyTicket />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="sos" element={<SOS />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={<PortalLayout role="admin" title="Temple Management" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="slot-control" element={<SlotControl />} />
          <Route path="reports" element={<Reports />} />
          <Route path="scan" element={<QRScan />} />
        </Route>

        {/* Security */}
        <Route
          path="/security"
          element={<PortalLayout role="security" title="Police & Security" />}
        >
          <Route index element={<SecurityDashboard />} />
          <Route path="deployment" element={<Deployment />} />
          <Route path="incidents" element={<Incidents />} />
        </Route>

        {/* Medical */}
        <Route
          path="/medical"
          element={<PortalLayout role="medical" title="Medical & Emergency" />}
        >
          <Route index element={<MedicalDashboard />} />
          <Route path="resources" element={<Resources />} />
          <Route path="emergency-log" element={<EmergencyLog />} />
        </Route>
        <Route path="/pilgrim/login" element={<Login />} />
<Route path="/pilgrim/register" element={<Register />} />
<Route path="/pilgrim/verify-otp" element={<VerifyOtp />} />
<Route path="/pilgrim/forgot-password" element={<ForgotPassword />} />
<Route path="/pilgrim/reset-password" element={<ResetPassword />} />


      </Routes>
    </BrowserRouter>
  );
}
