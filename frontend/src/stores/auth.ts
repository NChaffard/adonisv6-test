import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const tokenValue = response.data.token.value || response.data.token
      token.value = tokenValue
      user.value = response.data.user
      localStorage.setItem('token', tokenValue)
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors,
      }
    }
  }

  const register = async (userData: { fullName: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', userData)
      const tokenValue = response.data.token.value || response.data.token
      token.value = tokenValue
      user.value = response.data.user
      localStorage.setItem('token', tokenValue)
      return { success: true }
    } catch (error: any) {
      // Gérer les erreurs de validation (status 422)
      if (error.response?.status === 422 && error.response?.data?.errors) {
        return {
          success: false,
          errors: error.response.data.errors,
          error: 'Erreurs de validation',
        }
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors,
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const fetchUser = async () => {
    if (!token.value) return

    try {
      const response = await api.get('/auth/me')
      user.value = response.data
    } catch (error) {
      logout()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
  }
})
