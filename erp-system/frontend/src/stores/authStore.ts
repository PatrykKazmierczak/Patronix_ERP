import { create } from 'zustand'
import axios from 'axios'

interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  is_superuser: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    try {
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)

      const response = await axios.post(`${API_URL}/api/auth/token`, formData)
      const { access_token } = response.data

      localStorage.setItem('token', access_token)
      set({ token: access_token, isAuthenticated: true })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  register: async (email: string, username: string, password: string) => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        email,
        username,
        password,
      })
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },
})) 