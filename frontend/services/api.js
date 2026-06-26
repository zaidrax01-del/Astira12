import axios from 'axios'

// Hardcoded backend API base URL – update this if you change the backend service name on Render
const API_BASE = 'https://astira12.onrender.com/api/v1'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

export default api
