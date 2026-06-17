import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('prepai_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally — token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('prepai_token')
      localStorage.removeItem('prepai_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

//Auth
export const signup = (data) => api.post('/api/auth/signup', data)
export const login = (data) => api.post('/api/auth/login', data)

//Generate
export const generateQuestions = (data) => api.post('/api/generate', data)

//History
export const getHistory = () => api.get('/api/history')
export const getSession = (id) => api.get(`/api/history/${id}`)
export const deleteSession = (id) => api.delete(`/api/history/${id}`)

//Bookmarks 
export const toggleBookmark = (id) => api.patch(`/api/questions/${id}/bookmark`)
export const getBookmarks = () => api.get('/api/bookmarks')

export default api