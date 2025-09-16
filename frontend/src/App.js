import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AlertsPage from "./pages/AlertsPage";
import ReportIssuePage from "./pages/ReportIssuePage";
import LoginSignupPage from "./pages/LoginSignupPage";
import AdminPage from "./pages/AdminPage";
import NotificationsPage from "./pages/NotificationsPage";
import Navbar from "./components/Navbar"; // ✅ import Navbar
import { useAuth } from "./context/AuthContext"; // ✅ auth context

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {/* ✅ Navbar at top */}
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* ✅ Only logged-in users can see these pages */}
        {user && <Route path="/report" element={<ReportIssuePage />} />}
        {user && <Route path="/alerts" element={<AlertsPage />} />}
        {user && <Route path="/notifications" element={<NotificationsPage />} />}

        {/* ✅ Admin only */}
        {user?.role === "admin" && <Route path="/admin" element={<AdminPage />} />}

        {/* ✅ Public */}
        <Route path="/auth" element={<LoginSignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
