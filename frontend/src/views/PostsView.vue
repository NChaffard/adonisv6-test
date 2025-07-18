<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold text-gray-900">
                {{ authStore.isAdmin ? 'Tous les Articles' : 'Mes Articles' }}
              </h1>
              <span
                v-if="authStore.isAdmin"
                class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                >Admin</span
              >
            </div>
            <p class="text-gray-600 mt-1">
              {{
                authStore.isAdmin
                  ? 'Gérez tous les articles de tous les utilisateurs'
                  : 'Gérez vos publications et créez de nouveaux contenus'
              }}
            </p>
          </div>
          <button @click="openCreateModal" class="btn-primary group">
            <svg
              class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Nouvel Article
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <!-- État vide -->
        <div v-if="filteredPosts.length === 0 && !postsStore.loading" class="text-center py-12">
          <div
            class="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4"
          >
            <svg
              class="h-8 w-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ authStore.isAdmin ? 'Aucun article' : 'Aucun article personnel' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{
              authStore.isAdmin
                ? "Aucun article n'a été créé par les utilisateurs."
                : 'Commencez par créer votre premier article pour partager vos idées !'
            }}
          </p>
          <button
            @click="openCreateModal"
            class="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Créer mon premier article
          </button>
        </div>

        <div v-if="postsStore.loading" class="text-center py-8">
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
            <p class="text-gray-500">Chargement des articles...</p>
          </div>
        </div>

        <TransitionGroup
          name="posts"
          tag="div"
          class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div v-for="post in filteredPosts" :key="post.id" class="post-card group">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-3">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div class="text-xs text-gray-500">{{ formatDate(post.createdAt) }}</div>
                  <div class="text-xs text-gray-400" v-if="post.user">
                    Par {{ post.user.fullName }}
                  </div>
                </div>
              </div>
              <div
                class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                v-if="post.userId === authStore.user?.id || authStore.isAdmin"
              >
                <span
                  v-if="authStore.isAdmin && post.userId !== authStore.user?.id"
                  class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full"
                  >Admin</span
                >
                <button
                  @click="openEditModal(post)"
                  class="btn-icon btn-icon-blue"
                  :title="
                    authStore.isAdmin && post.userId !== authStore.user?.id
                      ? 'Éditer (Admin)'
                      : 'Éditer'
                  "
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
                <button
                  @click="deletePost(post.id)"
                  class="btn-icon btn-icon-red"
                  :title="
                    authStore.isAdmin && post.userId !== authStore.user?.id
                      ? 'Supprimer (Admin)'
                      : 'Supprimer'
                  "
                >
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
            <h3
              class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer"
              @click="viewPost(post.id)"
            >
              {{ post.title }}
            </h3>
            <div class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ post.excerpt }}
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Modale de création/édition -->
    <PostFormModal
      :show="showModal"
      :editing-post="editingPost"
      @close="closeModal"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'
import { useNotifications } from '../composables/useNotifications'
import PostFormModal from '../components/PostFormModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const postsStore = usePostsStore()
const { success, error } = useNotifications()

const showModal = ref(false)
const editingPost = ref<any>(null)

// Les posts sont maintenant filtrés côté backend selon le rôle de l'utilisateur
const filteredPosts = computed(() => postsStore.posts)

const loadPosts = async () => {
  await postsStore.fetchPosts()
}

const openCreateModal = () => {
  editingPost.value = null
  showModal.value = true
}

const viewPost = (postId: number) => {
  router.push(`/posts/${postId}`)
}

const openEditModal = (post: any) => {
  editingPost.value = { ...post }
  showModal.value = true
}

const closeModal = () => {
  console.log('🔵 PostsView: closeModal appelé')
  showModal.value = false
  editingPost.value = null
  // Nettoyer les erreurs du store au cas où
  postsStore.clearError()
  console.log('🔵 PostsView: showModal maintenant =', showModal.value)
}

const handleModalSuccess = async () => {
  console.log('🔵 PostsView: handleModalSuccess appelé - fermeture de la modale')
  // Les posts sont déjà mis à jour dans le store par la modale
  // Fermer la modale proprement
  closeModal()
}

const deletePost = async (postId: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    return
  }

  const result = await postsStore.deletePost(postId)

  if (result.success) {
    success('Article supprimé !', "L'article a été supprimé avec succès.")
  } else if (result.error) {
    error('Erreur de suppression', result.error)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md flex items-center;
}

.btn-primary:hover {
  @apply transform -translate-y-0.5;
}

.btn-icon {
  @apply p-2 rounded-lg transition-all duration-200 hover:shadow-md;
}

.btn-icon-blue {
  @apply text-blue-600 hover:bg-blue-50 hover:text-blue-700;
}

.btn-icon-red {
  @apply text-red-600 hover:bg-red-50 hover:text-red-700;
}

.post-card {
  @apply bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md hover:bg-white transition-all duration-200 hover:border-gray-300;
}

.post-card:hover {
  @apply transform -translate-y-1;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animations d'entrée */
.post-card {
  animation: slideInUp 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .post-card {
    @apply p-4;
  }
}
</style>
