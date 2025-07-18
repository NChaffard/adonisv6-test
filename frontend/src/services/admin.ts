import api from './api'
import type { Post } from './posts'

export interface AdminStats {
  totalUsers: number
  adminUsers: number
  regularUsers: number
  recentUsers: number
}

export interface UserData {
  id: number
  fullName: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt?: string
}

export interface CreateUserData {
  fullName: string
  email: string
  password: string
  role?: 'user' | 'admin'
}

export interface UpdateUserData {
  fullName?: string
  email?: string
  role?: 'user' | 'admin'
}

export const AdminService = {
  // Récupérer les statistiques
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats')
    return response.data
  },

  // Récupérer tous les utilisateurs
  async getUsers(): Promise<{ users: UserData[]; total: number }> {
    const response = await api.get('/admin/users')
    return response.data
  },

  // Créer un utilisateur
  async createUser(userData: CreateUserData): Promise<{ message: string; user: UserData }> {
    const response = await api.post('/admin/users', userData)
    return response.data
  },

  // Mettre à jour un utilisateur
  async updateUser(
    userId: number,
    userData: UpdateUserData
  ): Promise<{ message: string; user: UserData }> {
    const response = await api.put(`/admin/users/${userId}`, userData)
    return response.data
  },

  // Supprimer un utilisateur
  async deleteUser(userId: number): Promise<{ message: string }> {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  // Changer le rôle d'un utilisateur
  async changeUserRole(
    userId: number,
    role: 'user' | 'admin'
  ): Promise<{ message: string; user: UserData }> {
    const response = await api.patch(`/admin/users/${userId}/role`, { role })
    return response.data
  },

  // Récupérer tous les posts (admin only)
  async getPosts(): Promise<Post[]> {
    const response = await api.get('/admin/posts')
    return response.data
  },
}
