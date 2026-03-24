import { Route, Routes } from "react-router-dom"
import LoginPage from "./page/LoginPage"
import RegisterPage from "./page/RegisterPage"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
