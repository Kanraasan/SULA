import { Route, Routes } from "react-router-dom"
import LoginPage from "./page/LoginPage"
import RegisterPage from "./page/RegisterPage"
import DashboardPage from "./page/admin/DashboardPage"
import LaporanPage from "./page/admin/LaporanPage"
import PetaWilayahPage from "./page/admin/PetaWilayahPage"
import StatistikPage from "./page/admin/StatistikPage"
import UserDashboardPage from "./page/users/DashboardPage"
import ReportFormPage from "./page/users/ReportForm"
import StatusLaporanPage from "./page/users/StatusLaporanPage"
import ReportDetailPage from "./page/users/ReportDetailPage"
import MyReportsPage from "./page/users/MyReportsPage"
import EditReportPage from "./page/users/EditReportPage"
import LeaderboardPage from "./page/users/Leaderboard"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user-dashboard" element={<UserDashboardPage />} />
      <Route path="/report-form" element={<ReportFormPage />} />
      <Route path="/my-reports" element={<MyReportsPage />} />
      <Route path="/edit-report/:id" element={<EditReportPage />} />
      <Route path="/status-laporan" element={<StatusLaporanPage />} />
      <Route path="/report-detail/:id" element={<ReportDetailPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/laporan" element={<LaporanPage />} />
      <Route path="/peta-wilayah" element={<PetaWilayahPage />} />
      <Route path="/statistik" element={<StatistikPage />} />
    </Routes>
  )
}

export default App
