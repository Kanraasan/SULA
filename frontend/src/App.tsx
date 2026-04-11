import { Route, Routes } from "react-router-dom"
import LoginPage from "./page/LoginPage"
import RegisterPage from "./page/RegisterPage"
import DashboardPage from "./page/admin/DashboardPage"
import AdminReportsPage from "./page/admin/AdminReportsPage"
import MapPage from "./page/admin/MapPage"
import StatisticsPage from "./page/admin/StatisticsPage"
import UserDashboardPage from "./page/user/DashboardPage"
import ReportFormPage from "./page/user/ReportFormPage"
import ReportStatusPage from "./page/user/ReportStatusPage"
import ReportDetailPage from "./page/user/ReportDetailPage"
import MyReportsPage from "./page/user/MyReportsPage"
import EditReportPage from "./page/user/EditReportPage"
import LeaderboardPage from "./page/user/LeaderboardPage"
import { ProtectedRoute } from "./hooks/ProtectedRoute"

export function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User & Admin Protected Routes */}
      <Route path="/user-dashboard" element={
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <UserDashboardPage />
        </ProtectedRoute>
      } />
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
      <Route path="/report-detail/:id" element={
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <ReportDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/leaderboard" element={
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <LeaderboardPage />
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
    </Routes>
  )
}

export default App
