import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  PostsService,
  type Post,
  type CreatePostData,
  type UpdatePostData,
} from '../services/posts'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const postsCount = computed(() => posts.value.length)

  const fetchPosts = async () => {
    loading.value = true
    error.value = null

    try {
      posts.value = await PostsService.getPosts()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des articles'
      console.error('Erreur lors du chargement des articles:', err)
    } finally {
      loading.value = false
    }
  }

  const createPost = async (data: CreatePostData) => {
    loading.value = true
    error.value = null

    try {
      const response = await PostsService.createPost(data)
      if (response.data) {
        posts.value.unshift(response.data)
        return { success: true, data: response.data }
      }
      return { success: false, error: response.message || 'Erreur lors de la création' }
    } catch (err: any) {
      let errorMessage = "Erreur lors de la création de l'article"

      // Gestion spécifique des erreurs de validation VineJS (422)
      if (err.response?.status === 422) {
        const validationErrors = err.response.data
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          errorMessage = validationErrors[0].message || errorMessage
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message
        }
      } else {
        errorMessage = err.response?.data?.message || errorMessage
      }

      error.value = errorMessage
      return {
        success: false,
        error: errorMessage,
        errors: err.response?.data,
      }
    } finally {
      loading.value = false
    }
  }

  const updatePost = async (id: number, data: UpdatePostData) => {
    loading.value = true
    error.value = null

    try {
      const response = await PostsService.updatePost(id, data)
      if (response.data) {
        const index = posts.value.findIndex((post) => post.id === id)
        if (index !== -1) {
          posts.value[index] = response.data
        }
        return { success: true, data: response.data }
      }
      return { success: false, error: response.message || 'Erreur lors de la mise à jour' }
    } catch (err: any) {
      let errorMessage = "Erreur lors de la mise à jour de l'article"

      // Gestion spécifique des erreurs de validation VineJS (422)
      if (err.response?.status === 422) {
        const validationErrors = err.response.data
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          errorMessage = validationErrors[0].message || errorMessage
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message
        }
      } else {
        errorMessage = err.response?.data?.message || errorMessage
      }

      error.value = errorMessage
      return {
        success: false,
        error: errorMessage,
        errors: err.response?.data,
      }
    } finally {
      loading.value = false
    }
  }

  const deletePost = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await PostsService.deletePost(id)
      posts.value = posts.value.filter((post) => post.id !== id)
      return { success: true }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erreur lors de la suppression de l'article"
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const fetchPost = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await PostsService.getPost(parseInt(id))
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erreur lors du chargement de l'article"
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  const getPostById = (id: number) => {
    return posts.value.find((post) => post.id === id)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    posts,
    loading,
    error,
    postsCount,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    clearError,
  }
})
