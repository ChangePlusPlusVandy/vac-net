import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./layouts/DashboardLayout";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/Login";
// import PrivateRoute from "./pages/Auth/PrivateRoute";
import React from "react";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Outlet />}>
        <Route index element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/app/dashboard" />} />
          <Route path="dashboard" element={<div>Dashboard</div>} />
          <Route path="beneficiaries" element={<div>Beneficiaries</div>} />
          <Route path="loans" element={<div>Loans</div>} />
          <Route path="sessions" element={<div>Sessions</div>} />
          <Route path="staff" element={<div>Staff</div>} />
          <Route path="support" element={<div>Support</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<div>404</div>} />
      </Route>
    </>,
  ),
);

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
