import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'

export default function TorneioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [jogo, setJogo] = useState('')
  const isEditar = !!id

  useEffect(() => {
    if (isEditar) {
      api.get('/torneios').then(res => {
        const t = res.data.find(t => t.id === parseInt(id))
        if (t) { setNome(t.nome); setJogo(t.jogo) }
      })
    }
  }, [id, isEditar])

  async function handleSubmit(e) {
    e.preventDefault()
    if (isEditar) {
      await api.put(`/torneios/${id}`, { nome, jogo })
    } else {
      await api.post('/torneios', { nome, jogo })
    }
    navigate('/torneios')
  }

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: 30, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{isEditar ? ' Editar Torneio' : ' Novo Torneio'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Nome do Torneio</label><br />
          <input value={nome} onChange={e => setNome(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Jogo</label><br />
          <input value={jogo} onChange={e => setJogo(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" style={{ flex: 1, padding: 10, background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {isEditar ? 'Guardar' : 'Criar'}
          </button>
          <button type="button" onClick={() => navigate('/torneios')} style={{ flex: 1, padding: 10, cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}