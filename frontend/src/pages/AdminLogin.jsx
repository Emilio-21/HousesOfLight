import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/admin/login', { username, password })
      localStorage.setItem('admin_token', res.data.access_token)
      navigate('/admin')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black tracking-tighter">HOUSES OF LIGHT</h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 mt-2">Panel de Administración</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-black/10 p-8 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
