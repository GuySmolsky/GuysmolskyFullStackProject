import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider, ThemeContext } from "./context/ThemeContext";
import { useContext } from "react";

import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import CompaniesPage from "./pages/CompaniesPage";
import CompanyDetailsPage from "./pages/CompanyDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function AppContent() {
  const { theme } = useContext(ThemeContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/reset-password/:token?"
                element={<ResetPasswordPage />}
              />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/companies/:id" element={<CompanyDetailsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route
                path="/employer/dashboard"
                element={<EmployerDashboard />}
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
}

export default App;
