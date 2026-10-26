import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { useSelector } from "react-redux";
import LandingPage from "./pages/Landing/LandingPage.jsx";
import Header from "./pages/traveler/Home/Header.jsx";
import HomePage from "./pages/traveler/Home/HomePage.jsx";
import SearchResults from "./pages/traveler/FlightList/SearchResults.jsx";

import PaymentPage from "./pages/traveler/Payment/PaymentPage.jsx";
import BookingHistory from "./pages/traveler/BookingHistory/BookingHistory.jsx";
import BookingSuccess from "./pages/traveler/BookingSuccess/BookingSuccess.jsx";
import ETicket from "./pages/traveler/Ticket/ETicket.jsx";
import Ticket from "./pages/traveler/Ticket/Ticket.jsx";
import UserProfile from "./pages/traveler/Profile/UserProfile.jsx";
import AirlineDashboard from "./pages/airline/Dashboard/AirlineDashboard.jsx";
import SuperAdminDashboard from "./pages/super-admin/Dashboard/SuperAdminDashboard.jsx";


import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserProfile } from "./Redux/user/userThunks.js";
import Auth from "./pages/auth/Auth.jsx";
import BookingReview from "./pages/traveler/BookingReview/BookingReview.jsx";
import AirlineOnboardingWizard from "./pages/Onboarding/AirlineOnboardingWizard";

function App() {
  // Role-based redirection logic
  function RoleRedirect() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    
    useEffect(() => {
      const token = localStorage.getItem("jwt");
      if (token && !user) {
        dispatch(getUserProfile(token));
      }
    }, [dispatch, user]);


    console.log("Auth State:", { isAuthenticated, user });

    useEffect(() => {
      if (isAuthenticated && user) {
        // Redirect based on user role
        switch (user.role) {
          case "ROLE_SYSTEM_ADMIN":
            navigate("/super-admin");
            break;
          case "ROLE_AIRLINE_OWNER":
            navigate("/airline");
            break;
          case "ROLE_USER":
          default:
            navigate("/traveler");
            break;
        }
      }
    }, [isAuthenticated, user, navigate]);

    return null;
  }

  // Protected route component for authentication pages
  function AuthProtected({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
      if (isAuthenticated) {
        // If user is already logged in, redirect them away from auth pages
        navigate("/");
      }
    }, [isAuthenticated, navigate]);

    return children;
  }
  // Protected route component for signed-in users
  function ProtectedRoute({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const hasToken = Boolean(localStorage.getItem("jwt"));

    useEffect(() => {
      if (!hasToken) {
        navigate("/login", {
          replace: true,
          state: { from: `${location.pathname}${location.search}` },
        });
      }
    }, [hasToken, navigate, location.pathname, location.search]);

    if (!hasToken) return null;
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm">Restoring your session…</p>
          </div>
        </div>
      );
    }
    return children;
  }
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background transition-colors">
          <Toaster />
          <Routes>
            {/* Authentication Routes - Protected for unauthenticated users only */}
            <Route
              path="/register"
              element={
                <AuthProtected>
                  <Auth isLogin={false} />
                </AuthProtected>
              }
            />
            <Route
              path="/login"
              element={
                <AuthProtected>
                  <Auth isLogin={true} />
                </AuthProtected>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AuthProtected>
                  <ForgotPassword />
                </AuthProtected>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <AuthProtected>
                  <ResetPassword />
                </AuthProtected>
              }
            />
            <Route
              path="/reset-password"
              element={
                <AuthProtected>
                  <ResetPassword />
                </AuthProtected>
              }
            />

            {/* Landing Page - With role-based redirection for logged in users */}
            <Route
              path="/"
              element={
                <>
                  <RoleRedirect />
                  <LandingPage />
                </>
              }
            />
            {/* <Route path="/onboarding" element={<OnboardingPage />} /> */}
            <Route path="/airline-onboarding" element={<AirlineOnboardingWizard />} />

            {/* Traveler Routes */}
            <Route
              path="/traveler"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <HomePage />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <SearchResults />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-results"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <SearchResults />
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/booking-review"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <BookingReview />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <PaymentPage />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <BookingHistory />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-success/:bookingId"
              element={<BookingSuccess />}
            />
            <Route
              path="/view-ticket/:bookingId"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <Ticket />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ticket/:pnr"
              element={
                <div>
                  <Header />
                  <ETicket />
                </div>
              }
            />
            <Route
              path="/ticket"
              element={
                <div>
                  <Header />
                  <ETicket />
                </div>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <UserProfile />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Airline Dashboard Routes */}
            <Route path="/airline/*" element={<AirlineDashboard />} />

            {/* Super Admin Dashboard Routes */}
            <Route path="/super-admin/*" element={<SuperAdminDashboard />} />

            {/* Unknown routes go back to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
