import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'

export default function EquipaForm() {
  const { torneioId, id } = useParams()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [numeroJogadores, setNumeroJogadores] = useState('')
  const isEditar = !!id

  useEffect(() => {
    if (isEditar) {
      api.get(`/torneios/${torneioId}/equipas`).then(res => {
        const e = res.data.find(e => e.id === parseInt(id))
        if (e) { setNome(e.nome); setNumeroJogadores(e.numeroJogadores) }
      })
    }
  }, [id, torneioId, isEditar])

  async function handleSubmit(e) {
    e.preventDefault()
    const dados = { nome, numeroJogadores: parseInt(numeroJogadores) }
    if (isEditar) {
      await api.put(`/torneios/${torneioId}/equipas/${id}`, dados)
    } else {
      await api.post(`/torneios/${torneioId}/equipas`, dados)
    }
    navigate(`/torneios/${torneioId}/equipas`)
  }

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: 30, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{isEditar ? ' Editar Equipa' : ' Nova Equipa'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Nome da Equipa</label><br />
          <input value={nome} onChange={e => setNome(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Número de Jogadores</label><br />
          <input type="number" value={numeroJogadores} onChange={e => setNumeroJogadores(e.target.value)} required min="1" style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" style={{ flex: 1, padding: 10, background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {isEditar ? 'Guardar' : 'Criar'}
          </button>
          <button type="button" onClick={() => navigate(`/torneios/${torneioId}/equipas`)} style={{ flex: 1, padding: 10, cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}