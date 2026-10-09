import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Support from "./pages/Support";
import LoginRegister from "./pages/LoginRegister";
import Dashboard from "./pages/v1/auth/dashboard/user/dashboard";

// Components
import Navbar from "./components/Navbar";
import DashboardNavbar from "./components/DashboardNavbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoite.jsx";
import ApiAccess from "./components/ApiAccess";
import Career from "./components/Career";
import Countries from "./components/Countries";
import Courier from "./components/Courier";

// Auth context
import { AuthProvider, useAuth } from "./context/AuthContext";
import Settings from "./pages/v1/auth/dashboard/user/Settings.js";

function Shell() {
  const { loggedIn } = useAuth();

  return (
    <>
      <ScrollToTop />

      <div className="d-flex flex-column min-vh-100">
        {/* Navbar swaps automatically based on login state */}
        {loggedIn ? <DashboardNavbar /> : <Navbar />}

        <main className="flex-grow-1" style={{ paddingTop: "84px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/support" element={<Support />} />
            <Route path="/apiaccess" element={<ApiAccess />} />
            <Route path="/career" element={<Career />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/courier" element={<Courier />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<LoginRegister />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Hide the main Footer on the dashboard if you want.
            Right now: Footer shows everywhere. */}
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;