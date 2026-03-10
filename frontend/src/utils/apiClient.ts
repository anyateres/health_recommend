import axios, { AxiosInstance } from 'axios'

const protocol = window.location.protocol === 'https:' ? 'https' : 'http'
const host = window.location.hostname
const port = window.location.port ? `:${window.location.port}` : ''
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
const baseURL = apiUrl ? `${apiUrl}/api` : `${protocol}://${host}${port === ':5173' ? ':3000' : port}/api`

const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
