import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import Beneficiaries from "./pages/beneficiaries/beneficiaries";
import Beneficiary from "./pages/beneficiaries/beneficiary";
import Dashboard from "./pages/dashboard/dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import EditSession from "./pages/sessions/session";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Loan from "./pages/loans/loan";
import Loans from "./pages/loans/loans";
import Login from "./pages/Auth/Login";
// import PrivateRoute from "./pages/Auth/PrivateRoute";
import React from "react";
import Register from "./pages/Auth/Register";
import Session from "./pages/sessions/sessions";
import Staff from "@/pages/staff/staff";
import StaffMembers from "@/pages/staff/staff-members";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route index element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/app/dashboard" />} />
        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/app/beneficiaries" element={<Beneficiaries />} />
        <Route path="/app/beneficiaries/:id" element={<Beneficiary />} />
        <Route path="/app/loans" element={<Loans />} />
        <Route path="/app/loans/:id" element={<Loan />} />
        <Route path="/app/sessions" element={<Session />} />
        <Route path="/app/sessions/:sessionId" element={<EditSession />} />
        <Route path="/app/staff" element={<StaffMembers />} />
        <Route path="/app/staff/:id" element={<Staff />} />
        <Route path="/app/support" element={<div>Support</div>} />
        <Route path="/app/settings" element={<div>Settings</div>} />
      </Route>

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<div>404</div>} />
    </Route>,
  ),
);

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
