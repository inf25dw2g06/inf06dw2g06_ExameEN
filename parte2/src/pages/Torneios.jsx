import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

export default function Torneios() {
  const [torneios, setTorneios] = useState([])
  const navigate = useNavigate()

  async function carregar() {
    const res = await api.get('/torneios')
    setTorneios(res.data)
  }

  async function apagar(id) {
    if (!window.confirm('Tens a certeza que queres apagar?')) return
    await api.delete(`/torneios/${id}`)
    carregar()
  }

  useEffect(() => { carregar() }, [])

  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🏆 Os meus Torneios</h2>
        <button onClick={() => navigate('/torneios/novo')} style={{ padding: '8px 16px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Novo Torneio
        </button>
      </div>
      {torneios.length === 0 && <p>Não tens torneios ainda.</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>ID</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Nome</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Jogo</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {torneios.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 10 }}>{t.id}</td>
              <td style={{ padding: 10 }}>{t.nome}</td>
              <td style={{ padding: 10 }}>{t.jogo}</td>
              <td style={{ padding: 10, display: 'flex', gap: 8 }}>
                <button onClick={() => navigate(`/torneios/${t.id}/editar`)} style={{ padding: '4px 10px', cursor: 'pointer' }}> Editar</button>
                <button onClick={() => navigate(`/torneios/${t.id}/equipas`)} style={{ padding: '4px 10px', cursor: 'pointer' }}> Equipas</button>
                <button onClick={() => apagar(t.id)} style={{ padding: '4px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}> Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}