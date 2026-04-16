import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '@/lib/api'

const AdminGuard = ({ children }) => {
  const [status, setStatus] = useState('checking') // checking | ok | denied

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { setStatus('denied'); return }

    api.get('/admin/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setStatus('ok'))
      .catch(() => { localStorage.removeItem('admin_token'); setStatus('denied') })
  }, [])

  if (status === 'checking') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (status === 'denied') return <Navigate to="/admin/login" replace />

  return children
}

export default AdminGuard
