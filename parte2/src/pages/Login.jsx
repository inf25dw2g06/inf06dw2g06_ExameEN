import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      await login(username, password)
      navigate('/torneios')
    } catch {
      setErro('Credenciais inválidas. Tenta novamente.')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 30, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>🎮 Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Username</label><br />
          <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit" style={{ width: '100%', padding: 10, background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  )
}