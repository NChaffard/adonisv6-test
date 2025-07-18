<template>
  <div class="space-y-6">
    <!-- Posts Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div v-if="postsLoading" class="p-6">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="w-20 h-6 bg-gray-200 rounded"></div>
            <div class="w-24 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="posts.length === 0" class="p-8 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun post</h3>
        <p class="mt-1 text-sm text-gray-500">Aucun post n'a été créé pour le moment.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Post
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Auteur
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Créé le
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Modifié le
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-start">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3"
                  >
                    <svg
                      class="w-5 h-5 text-blue-600"
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
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ post.title }}</div>
                    <div class="text-sm text-gray-500 truncate mt-1">
                      {{ post.content.substring(0, 100)
                      }}{{ post.content.length > 100 ? '...' : '' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2"
                  >
                    <span class="text-purple-600 font-semibold text-xs">{{
                      getUserInitials(post.user?.fullName || 'U')
                    }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ post.user?.fullName || 'Utilisateur inconnu' }}
                    </div>
                    <div class="text-sm text-gray-500">{{ post.user?.email || '' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(post.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(post.updatedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  @click="viewPost(post)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Voir
                </button>
                <button
                  @click="confirmDeletePost(post)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Post Modal -->
    <Modal v-model="showViewModal" :title="viewingPost?.title || 'Post'">
      <div v-if="viewingPost" class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ viewingPost.title }}</h3>
          <div class="text-sm text-gray-500 mb-4">
            Par {{ viewingPost.user?.fullName || 'Utilisateur inconnu' }} •
            {{ formatDate(viewingPost.createdAt) }}
          </div>
        </div>

        <div class="border-t pt-4">
          <div class="prose max-w-none">
            <div class="whitespace-pre-wrap text-sm text-gray-700">{{ viewingPost.content }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="showViewModal = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Fermer
        </button>
      </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Confirmer la suppression">
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Êtes-vous sûr de vouloir supprimer le post <strong>{{ postToDelete?.title }}</strong> ?
        </p>
        <p class="text-sm text-red-600 font-medium">Cette action est irréversible.</p>
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="deletePost"
            :disabled="deleteLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {{ deleteLoading ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PostsService, type Post } from '../../services/posts'
import { AdminService } from '../../services/admin'
import Modal from '../../components/Modal.vue'

const emit = defineEmits<{
  message: [message: string, type: 'success' | 'error']
}>()

// State
const postsLoading = ref(true)
const posts = ref<Post[]>([])

// Modals
const showViewModal = ref(false)
const showDeleteModal = ref(false)

// Selected items
const viewingPost = ref<Post | null>(null)
const postToDelete = ref<Post | null>(null)

// Loading states
const deleteLoading = ref(false)

// Methods
const getUserInitials = (fullName: string) => {
  const names = fullName.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  }
  return fullName[0].toUpperCase()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const loadPosts = async () => {
  try {
    postsLoading.value = true
    // Utiliser l'endpoint admin pour récupérer tous les posts
    posts.value = await AdminService.getPosts()
  } catch (error: any) {
    emit('message', error.response?.data?.message || 'Erreur lors du chargement des posts', 'error')
  } finally {
    postsLoading.value = false
  }
}

const viewPost = (post: Post) => {
  viewingPost.value = post
  showViewModal.value = true
}

const confirmDeletePost = (post: Post) => {
  postToDelete.value = post
  showDeleteModal.value = true
}

const deletePost = async () => {
  if (!postToDelete.value) return

  try {
    deleteLoading.value = true
    await PostsService.deletePost(postToDelete.value.id)
    posts.value = posts.value.filter((p) => p.id !== postToDelete.value!.id)
    emit('message', 'Post supprimé avec succès', 'success')
    showDeleteModal.value = false
    postToDelete.value = null
  } catch (error: any) {
    emit(
      'message',
      error.response?.data?.message || 'Erreur lors de la suppression du post',
      'error'
    )
  } finally {
    deleteLoading.value = false
  }
}

onMounted(() => {
  loadPosts()
})
</script>
