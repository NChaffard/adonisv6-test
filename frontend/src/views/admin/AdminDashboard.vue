<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div class="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
        <div class="h-6 bg-gray-200 rounded mb-2"></div>
        <div class="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Users -->
      <div
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              ></path>
            </svg>
          </div>
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 17l9.2-9.2M15 15H9v-6"
            ></path>
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-600 mb-1">Total Utilisateurs</h3>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.totalUsers || 0 }}</p>
      </div>

      <!-- Total Posts -->
      <div
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              class="w-6 h-6 text-green-600"
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
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-600 mb-1">Total Posts</h3>
        <p class="text-2xl font-bold text-gray-900">{{ totalPosts || 0 }}</p>
      </div>

      <!-- Admin Users -->
      <div
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              ></path>
            </svg>
          </div>
          <svg
            class="w-5 h-5 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-600 mb-1">Administrateurs</h3>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.adminUsers || 0 }}</p>
      </div>

      <!-- Recent Users -->
      <div
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              class="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <svg
            class="w-5 h-5 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            ></path>
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-600 mb-1">Nouveaux (7j)</h3>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.recentUsers || 0 }}</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Users -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Utilisateurs récents</h3>
          <button
            @click="$emit('navigate', 'users')"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Voir tous
          </button>
        </div>
        <div v-if="usersLoading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-3 animate-pulse">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <div v-else-if="recentUsers.length === 0" class="text-center py-8">
          <p class="text-gray-500">Aucun utilisateur récent</p>
        </div>
        <div v-else class="space-y-3">
          <div v-for="user in recentUsers" :key="user.id" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 font-semibold text-sm">{{
                getUserInitials(user.fullName)
              }}</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ user.fullName }}</p>
              <p class="text-xs text-gray-500">{{ user.email }}</p>
            </div>
            <span
              :class="[
                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800',
              ]"
            >
              {{ user.role === 'admin' ? 'Admin' : 'User' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Posts récents</h3>
          <button
            @click="$emit('navigate', 'posts')"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Voir tous
          </button>
        </div>
        <div v-if="postsLoading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div v-else-if="recentPosts.length === 0" class="text-center py-8">
          <p class="text-gray-500">Aucun post récent</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="post in recentPosts"
            :key="post.id"
            class="border-b border-gray-100 pb-3 last:border-0"
          >
            <h4 class="text-sm font-medium text-gray-900 truncate">{{ post.title }}</h4>
            <p class="text-xs text-gray-500 mt-1">
              Par {{ post.user?.fullName || 'Inconnu' }} • {{ formatDate(post.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          @click="$emit('navigate', 'users')"
          class="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
        >
          <div
            class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              ></path>
            </svg>
          </div>
          <div class="text-left">
            <h4 class="font-semibold text-blue-900">Gérer les utilisateurs</h4>
            <p class="text-sm text-blue-600">Créer, modifier, supprimer</p>
          </div>
        </button>

        <button
          @click="$emit('navigate', 'posts')"
          class="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
        >
          <div
            class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <div class="text-left">
            <h4 class="font-semibold text-green-900">Gérer les posts</h4>
            <p class="text-sm text-green-600">Modérer, supprimer</p>
          </div>
        </button>

        <button
          @click="$emit('navigate', 'analytics')"
          class="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
        >
          <div
            class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
          </div>
          <div class="text-left">
            <h4 class="font-semibold text-purple-900">Voir les analytics</h4>
            <p class="text-sm text-purple-600">Graphiques et statistiques</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AdminService, type AdminStats, type UserData } from '../../services/admin'
import { PostsService, type Post } from '../../services/posts'

const emit = defineEmits<{
  navigate: [section: string]
}>()

// State
const loading = ref(true)
const usersLoading = ref(true)
const postsLoading = ref(true)
const stats = ref<AdminStats | null>(null)
const users = ref<UserData[]>([])
const posts = ref<Post[]>([])

// Computed
const totalPosts = computed(() => posts.value.length)
const recentUsers = computed(() => users.value.slice(0, 5))
const recentPosts = computed(() => posts.value.slice(0, 5))

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

const loadStats = async () => {
  try {
    stats.value = await AdminService.getStats()
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    usersLoading.value = true
    const response = await AdminService.getUsers()
    users.value = response.users
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  } finally {
    usersLoading.value = false
  }
}

const loadPosts = async () => {
  try {
    postsLoading.value = true
    // Utiliser l'endpoint admin pour récupérer tous les posts
    posts.value = await AdminService.getPosts()
  } catch (error) {
    console.error('Erreur lors du chargement des posts:', error)
  } finally {
    postsLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadStats(), loadUsers(), loadPosts()])
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.5s ease-out;
}

/* Hover effects */
.hover\:shadow-md:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
