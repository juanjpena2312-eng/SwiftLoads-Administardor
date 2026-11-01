import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api'
})

// Adjunta el token en cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el token expiró o es inválido, vuelve al login
api.interceptors.response.use(
  respuesta => respuesta,
  error => {
    const esLogin = error.config?.url?.includes('/admin/login')
    if (error.response?.status === 401 && !esLogin) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function mensajeError(error) {
  if (!error.response) return 'No se pudo conectar con el servidor.'
  return error.response.data?.mensaje || 'Ocurrió un error. Intenta de nuevo.'
}

export default api