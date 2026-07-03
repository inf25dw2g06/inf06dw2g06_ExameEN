import { createContext, useContext, useState } from 'react'
import api from '../api/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    return token ? { token, username } : null
  })

  async function login(username, password) {
    const res = await api.post('/auth/token', { username, password })
    const token = res.data.access_token
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    setUser({ token, username })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}