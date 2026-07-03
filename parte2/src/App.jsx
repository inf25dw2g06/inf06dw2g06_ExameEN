import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Torneios from './pages/Torneios'
import TorneioForm from './pages/TorneioForm'
import Equipas from './pages/Equipas'
import EquipaForm from './pages/EquipaForm'

function Navbar() {
  const { user, logout } = useAuth()
  if (!user) return null
  return (
    <nav style={{ padding: '10px 20px', background: '#1a1a2e', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <span style={{ fontWeight: 'bold', marginRight: 'auto' }}> Torneios App</span>
      <span>Olá, <strong>{user.username}</strong></span>
      <Link to="/torneios" style={{ color: 'white' }}>Torneios</Link>
      <button onClick={logout} style={{ cursor: 'pointer' }}>Logout</button>
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/torneios" element={<PrivateRoute><Torneios /></PrivateRoute>} />
          <Route path="/torneios/novo" element={<PrivateRoute><TorneioForm /></PrivateRoute>} />
          <Route path="/torneios/:id/editar" element={<PrivateRoute><TorneioForm /></PrivateRoute>} />
          <Route path="/torneios/:torneioId/equipas" element={<PrivateRoute><Equipas /></PrivateRoute>} />
          <Route path="/torneios/:torneioId/equipas/nova" element={<PrivateRoute><EquipaForm /></PrivateRoute>} />
          <Route path="/torneios/:torneioId/equipas/:id/editar" element={<PrivateRoute><EquipaForm /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/torneios" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}