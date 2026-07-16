import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import NewReviewPage from "./pages/NewReviewPage";
import ReviewResultPage from "./pages/ReviewResultPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BillingPage from "./pages/BillingPage";
import CheckoutMock from "./pages/CheckoutMock";
import PortalMock from "./pages/PortalMock";

// Auth Guard
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark-900 text-gray-100 antialiased selection:bg-brand-600 selection:text-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews/new"
              element={
                <ProtectedRoute>
                  <NewReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews/:id"
              element={
                <ProtectedRoute>
                  <ReviewResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <BillingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout-mock"
              element={
                <ProtectedRoute>
                  <CheckoutMock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal-mock"
              element={
                <ProtectedRoute>
                  <PortalMock />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}
