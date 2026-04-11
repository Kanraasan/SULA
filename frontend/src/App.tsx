import { Route, Routes, Navigate } from "react-router-dom"
import LoginPage from "./page/LoginPage"
import RegisterPage from "./page/RegisterPage"
import DashboardPage from "./page/admin/DashboardPage"
import AdminReportsPage from "./page/admin/AdminReportsPage"
import MapPage from "./page/admin/MapPage"
import StatisticsPage from "./page/admin/StatisticsPage"
import AdminSettingPage from "./page/admin/SettingPage"
import UserDashboardPage from "./page/user/DashboardPage"
import ReportFormPage from "./page/user/ReportFormPage"
import ReportStatusPage from "./page/user/ReportStatusPage"
import ReportDetailPage from "./page/user/ReportDetailPage"
import MyReportsPage from "./page/user/MyReportsPage"
import EditReportPage from "./page/user/EditReportPage"
import LeaderboardPage from "./page/user/LeaderboardPage"
import UserSettingPage from "./page/user/SettingPage"
import { ProtectedRoute } from "./hooks/ProtectedRoute"
import { useAuth } from "./hooks/useAuth"

function RootRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user?.role === "admin") {
    return <Navigate to="/dashboard" replace />
  }
  return <UserDashboardPage />
}

export function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/report-detail/:id" element={<ReportDetailPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />

      {/* User & Admin Protected Routes */}
      <Route path="/report-form" element={
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <ReportFormPage />
        </ProtectedRoute>
      } />
      <Route path="/my-reports" element={
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <MyReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/edit-report/:id" element={
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <EditReportPage />
        </ProtectedRoute>
      } />
      <Route path="/status-laporan" element={
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <ReportStatusPage />
        </ProtectedRoute>
      } />
      <Route path="/user-settings" element={
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <UserSettingPage />
        </ProtectedRoute>
      } />
      {/* Admin ONLY Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/laporan" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/peta-wilayah" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <MapPage />
        </ProtectedRoute>
      } />
      <Route path="/statistik" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <StatisticsPage />
        </ProtectedRoute>
      } />
      <Route path="/setting" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminSettingPage />
        </ProtectedRoute>
      } />
      
      {/* 404 Fallback Route - Redirect to Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
