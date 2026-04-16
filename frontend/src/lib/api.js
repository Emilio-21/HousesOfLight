import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''
const api = axios.create({ baseURL: `${BASE}/api`, headers: { 'Content-Type': 'application/json' } })

export const getVideos         = (p) => api.get('/videos', { params: p })
export const getFeaturedVideos = ()  => api.get('/videos/featured')
export const getRecentVideos   = (n) => api.get('/videos/recent', { params: { limit: n } })
export const getVideo          = (id) => api.get(`/videos/${id}`)
export const createVideo       = (d) => api.post('/videos', d)
export const updateVideo       = (id, d) => api.put(`/videos/${id}`, d)
export const deleteVideo       = (id) => api.delete(`/videos/${id}`)
export const incrementView     = (id) => api.post(`/videos/${id}/view`)

export const getCategories  = (t)    => api.get('/categories', { params: t ? { type: t } : {} })
export const getCategory    = (id)   => api.get(`/categories/${id}`)
export const createCategory = (d)    => api.post('/categories', d)
export const updateCategory = (id,d) => api.put(`/categories/${id}`, d)
export const deleteCategory = (id)   => api.delete(`/categories/${id}`)

export const getSpeakers  = ()      => api.get('/speakers')
export const getSpeaker   = (id)    => api.get(`/speakers/${id}`)
export const createSpeaker = (d)    => api.post('/speakers', d)
export const updateSpeaker = (id,d) => api.put(`/speakers/${id}`, d)
export const deleteSpeaker = (id)   => api.delete(`/speakers/${id}`)

export const getStats = () => api.get('/stats')

export default api
