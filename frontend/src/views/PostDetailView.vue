<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center gap-3">
          <svg class="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="text-gray-500">Chargement de l'article...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <div class="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Article non trouvé</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <router-link to="/posts" class="btn-primary">Retour aux articles</router-link>
      </div>

      <!-- Article content -->
      <div v-else-if="post" class="bg-white rounded-xl shadow-sm border border-gray-100">
        <!-- Header -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <router-link
              to="/posts"
              class="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Retour aux articles
            </router-link>

            <div class="flex items-center gap-2" v-if="canEdit">
              <button
                @click="openEditModal"
                class="btn-icon btn-icon-blue"
                title="Éditer l'article"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
              <button @click="deletePost" class="btn-icon btn-icon-red" title="Supprimer l'article">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>

          <div class="flex items-center gap-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <span>{{ post.user?.fullName || 'Utilisateur' }}</span>
            </div>

            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>{{ formatDate(post.createdAt) }}</span>
            </div>

            <div class="flex items-center gap-2" v-if="post.readingTime">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
              <span>{{ post.readingTime }} min de lecture</span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="markdown-content">
            <MarkdownRenderer :content="post.content" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition -->
    <PostFormModal
      :show="showEditModal"
      :editing-post="post"
      @close="closeEditModal"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'
import { useNotifications } from '../composables/useNotifications'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import PostFormModal from '../components/PostFormModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const postsStore = usePostsStore()
const { success, error: notifyError } = useNotifications()

const loading = ref(true)
const error = ref('')
const post = ref<any>(null)
const showEditModal = ref(false)

// Vérifier si l'utilisateur peut éditer cet article
const canEdit = computed(() => {
  return post.value && (authStore.isAdmin || post.value.userId === authStore.user?.id)
})

const fetchPost = async () => {
  try {
    loading.value = true
    error.value = ''

    const postId = route.params.id as string
    const response = await postsStore.fetchPost(postId)
    post.value = response
  } catch (err: any) {
    error.value = err.message || "Erreur lors du chargement de l'article"
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const openEditModal = () => {
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleEditSuccess = () => {
  showEditModal.value = false
  fetchPost() // Recharger l'article pour avoir les dernières modifications
}

const deletePost = async () => {
  if (!post.value) return

  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    try {
      await postsStore.deletePost(post.value.id)
      success('Article supprimé avec succès')
      router.push('/posts')
    } catch (err: any) {
      notifyError(err.message || 'Erreur lors de la suppression')
    }
  }
}

onMounted(() => {
  fetchPost()
})
</script>

<style scoped>
.markdown-content {
  max-width: none;
  line-height: 1.6;
}

/* Styles minimalistes pour ne pas interférer avec les styles GitHub */
.markdown-content :deep(.v-md-editor-preview) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>
