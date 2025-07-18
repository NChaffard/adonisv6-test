import api from './api'

export interface Post {
  id: number
  title: string
  content: string
  contentHtml: string
  excerpt: string
  readingTime: number
  contentPlainText: string
  userId: number
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    fullName: string
    email: string
  }
}

export interface CreatePostData {
  title: string
  content: string
}

export interface UpdatePostData {
  title?: string
  content?: string
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PostStats {
  postsCount: number
  lastPost: string | null
}

export class PostsService {
  static async getPosts(): Promise<Post[]> {
    const response = await api.get<Post[]>('/posts')
    return response.data
  }

  static async getPost(id: number): Promise<Post> {
    const response = await api.get<Post>(`/posts/${id}`)
    return response.data
  }

  static async createPost(data: CreatePostData): Promise<ApiResponse<Post>> {
    const response = await api.post<ApiResponse<Post>>('/posts', data)
    return response.data
  }

  static async updatePost(id: number, data: UpdatePostData): Promise<ApiResponse<Post>> {
    const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, data)
    return response.data
  }

  static async deletePost(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/posts/${id}`)
    return response.data
  }

  static async getStats(): Promise<PostStats> {
    const posts = await this.getPosts()
    const postsCount = posts.length

    let lastPost: string | null = null
    if (posts.length > 0) {
      const sortedPosts = posts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      const lastPostDate = new Date(sortedPosts[0].createdAt)
      const now = new Date()
      const diffInDays = Math.floor(
        (now.getTime() - lastPostDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffInDays === 0) {
        lastPost = "Aujourd'hui"
      } else if (diffInDays === 1) {
        lastPost = 'Hier'
      } else {
        lastPost = `Il y a ${diffInDays} jours`
      }
    }

    return { postsCount, lastPost }
  }
}
