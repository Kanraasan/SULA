import { Route, Routes } from "react-router-dom"
import LoginPage from "./page/LoginPage"
import RegisterPage from "./page/RegisterPage"
import DashboardPage from "./page/admin/DashboardPage"
import LaporanPage from "./page/admin/LaporanPage"
import PetaWilayahPage from "./page/admin/PetaWilayahPage"
import StatistikPage from "./page/admin/StatistikPage"
import UserDashboardPage from "./page/user/DashboardPage"
import ReportFormPage from "./page/user/ReportForm"
import StatusLaporanPage from "./page/user/StatusLaporanPage"
import ReportDetailPage from "./page/user/ReportDetailPage"
import MyReportsPage from "./page/user/MyReportsPage"
import EditReportPage from "./page/user/EditReportPage"
import LeaderboardPage from "./page/user/Leaderboard"
import { ProtectedRoute } from "./hooks/ProtectedRoute"
import AdminSettingPage from "./page/admin/SettingPage"

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
          <StatusLaporanPage />
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
          <LaporanPage />
        </ProtectedRoute>
      } />
      <Route path="/peta-wilayah" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <PetaWilayahPage />
        </ProtectedRoute>
      } />
      <Route path="/statistik" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <StatistikPage />
        </ProtectedRoute>
      } />
      <Route path="/setting" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminSettingPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
