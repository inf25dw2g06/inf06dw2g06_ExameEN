import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'

export default function Equipas() {
  const { torneioId } = useParams()
  const [equipas, setEquipas] = useState([])
  const [nomeTorneio, setNomeTorneio] = useState('')
  const navigate = useNavigate()

  async function carregar() {
    const res = await api.get(`/torneios/${torneioId}/equipas`)
    setEquipas(res.data)
    const torneios = await api.get('/torneios')
    const t = torneios.data.find(t => t.id === parseInt(torneioId))
    if (t) setNomeTorneio(t.nome)
  }

  async function apagar(id) {
    if (!window.confirm('Tens a certeza?')) return
    await api.delete(`/torneios/${torneioId}/equipas/${id}`)
    carregar()
  }

  useEffect(() => { carregar() }, [torneioId])

  return (
    <div style={{ padding: 30 }}>
      <button onClick={() => navigate('/torneios')} style={{ marginBottom: 20, cursor: 'pointer' }}>
        ← Voltar aos Torneios
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>👥 Equipas — {nomeTorneio}</h2>
        <button onClick={() => navigate(`/torneios/${torneioId}/equipas/nova`)} style={{ padding: '8px 16px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Nova Equipa
        </button>
      </div>
      {equipas.length === 0 && <p>Este torneio não tem equipas ainda.</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>ID</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Nome</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Nº Jogadores</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {equipas.map(e => (
            <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 10 }}>{e.id}</td>
              <td style={{ padding: 10 }}>{e.nome}</td>
              <td style={{ padding: 10 }}>{e.numeroJogadores}</td>
              <td style={{ padding: 10, display: 'flex', gap: 8 }}>
                <button onClick={() => navigate(`/torneios/${torneioId}/equipas/${e.id}/editar`)} style={{ padding: '4px 10px', cursor: 'pointer' }}> Editar</button>
                <button onClick={() => apagar(e.id)} style={{ padding: '4px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}> Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}