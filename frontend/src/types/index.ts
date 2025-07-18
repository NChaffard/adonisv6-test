export interface User {
  id: number
  email: string
  fullName: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: number
  title: string
  content: string
  userId: number
  user?: User
  createdAt: string
  updatedAt: string
}

export interface PostStats {
  postsCount: number
  lastPost: string | null
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
  errors?: Record<string, string | string[]>
}

export interface PostResponse {
  success: boolean
  post?: Post
  error?: string
  errors?: Record<string, string | string[]>
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  timeout?: number
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface FormErrors {
  [key: string]: string
}
