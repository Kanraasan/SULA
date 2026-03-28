import { Route, Routes } from "react-router-dom"
import LoginPage from "./page/LoginPage"
import RegisterPage from "./page/RegisterPage"
import DashboardPage from "./page/admin/DashboardPage"
import LaporanPage from "./page/admin/LaporanPage"
import PetaWilayahPage from "./page/admin/PetaWilayahPage"
import StatistikPage from "./page/admin/StatistikPage"
import UserDashboardPage from "./page/users/DashboardPage"
import ReportFormPage from "./page/users/ReportForm"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user-dashboard" element={<UserDashboardPage />} />
      <Route path="/report-form" element={<ReportFormPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/laporan" element={<LaporanPage />} />
      <Route path="/peta-wilayah" element={<PetaWilayahPage />} />
      <Route path="/statistik" element={<StatistikPage />} />
    </Routes>
  )
}

export default App
