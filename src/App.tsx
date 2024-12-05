import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./hooks/useAuth";

import LandingPage from "@/pages/landing";
import Institute from "./pages/institute";
import AICTEDashboard from "./pages/institute/dashboard";
import InstituteApplication from "./pages/institute/applications";
import LoginPage from "./pages/institute/auth/login";
import RegisterPage from "./pages/institute/auth/register";
import ForgotPasswordPage from "./pages/institute/auth/forgot";
import ApplicationData from "./pages/institute/applications/Application";
import Settings from "./pages/institute/settings";
import InstituteOtpForm from "./pages/institute/auth/otp";
import { api } from "./lib/utils";
import UploadLegalDocument from "./pages/institute/applications/UploadDocument";

export const queryClient = new QueryClient();

export default function App() {
  const { token, mode } = useAuthStore();
  api.defaults.headers.Authorization = token;
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Landing Page route */}
        <Route
          path="/"
          element={
            !token || !mode ? (
              <LandingPage />
            ) : (
              <Navigate to="/institute/dashboard" replace />
            )
          }
        />

        {/* Auth Routes (accessible only when not logged in) */}
        {!token || !mode ? (
          <>
            <Route path="/institute/login" element={<LoginPage />} />
            <Route path="/institute/register" element={<RegisterPage />} />
            <Route path="/institute/otp" element={<InstituteOtpForm />} />
            <Route path="/institute/forgot" element={<ForgotPasswordPage />} />
            <Route
              path="/institute/*"
              element={<Navigate to="/institute/login" />}
            />
          </>
        ) : (
          // Redirect logged-in users trying to access auth routes
          <>
            <Route
              path="/institute/login"
              element={<Navigate to="/institute/dashboard" replace />}
            />
            <Route
              path="/institute/register"
              element={<Navigate to="/institute/dashboard" replace />}
            />
            <Route
              path="/institute/forgot"
              element={<Navigate to="/institute/dashboard" replace />}
            />
          </>
        )}

        {/* Institute Routes (Protected) */}
        {token && mode && (
          <Route path="/institute">
            <Route
              index
              element={<Navigate to="/institute/dashboard" replace />}
            />
            <Route path="dashboard" element={<AICTEDashboard />} />
            <Route path="applications" element={<InstituteApplication />} />
            <Route path="upload-document" element={<UploadLegalDocument />} />
            <Route path="applications/:id" element={<ApplicationData />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        )}

        {/* Catch-all route */}
        <Route
          path="*"
          element={<div className="p-4">This page does not exist</div>}
        />
      </Routes>
    </QueryClientProvider>
  );
}
