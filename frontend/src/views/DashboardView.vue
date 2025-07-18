<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-lg text-gray-600 mt-1">
              Bienvenue, {{ user?.fullName || 'Utilisateur' }} !
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-500">{{ getCurrentDate() }}</span>
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white font-semibold text-sm">{{ getUserInitials() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'erreur -->
      <Transition
        name="error"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 transform scale-95"
        enter-to-class="opacity-100 transform scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 transform scale-100"
        leave-to-class="opacity-0 transform scale-95"
      >
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center"
        >
          <svg
            class="h-5 w-5 text-red-400 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
          <div class="flex-1">
            <p class="text-red-700 font-medium">{{ error }}</p>
            <button
              @click="loadStats"
              class="mt-2 text-red-600 hover:text-red-800 underline font-medium text-sm"
            >
              Réessayer
            </button>
          </div>
        </div>
      </Transition>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div class="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
          <div class="h-6 bg-gray-200 rounded mb-2"></div>
          <div class="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      <!-- Statistiques -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Posts Count -->
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </div>
            <svg
              class="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 17l9.2-9.2M15 15H9v-6"
              ></path>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Mes articles</h3>
          <p class="text-2xl font-bold text-gray-900">{{ stats.postsCount }}</p>
        </div>

        <!-- Last Post -->
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <svg
              class="w-5 h-5 text-blue-500"
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
          <h3 class="text-sm font-medium text-gray-600 mb-1">Ma dernière publication</h3>
          <p class="text-lg font-semibold text-gray-900">{{ stats.lastPost || 'Aucune' }}</p>
        </div>

        <!-- User Since -->
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              ></path>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Membre depuis</h3>
          <p class="text-lg font-semibold text-gray-900">{{ formatMemberSince() }}</p>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <router-link
            to="/posts"
            class="action-card bg-blue-50 hover:bg-blue-100 border-blue-200 group"
          >
            <div
              class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
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
            <h3 class="font-semibold text-blue-900 mb-1">Mes articles</h3>
            <p class="text-sm text-blue-600">Gérer mes publications</p>
          </router-link>

          <router-link
            to="/posts/new"
            class="action-card bg-green-50 hover:bg-green-100 border-green-200 group"
          >
            <div
              class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
            </div>
            <h3 class="font-semibold text-green-900 mb-1">Nouvel article</h3>
            <p class="text-sm text-green-600">Créer une publication</p>
          </router-link>

          <button
            @click="handleLogout"
            class="action-card bg-red-50 hover:bg-red-100 border-red-200 group text-left"
          >
            <div
              class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
            </div>
            <h3 class="font-semibold text-red-900 mb-1">Se déconnecter</h3>
            <p class="text-sm text-red-600">Quitter la session</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { PostsService, type PostStats } from '../services/posts'

const router = useRouter()
const authStore = useAuthStore()

const user = ref(authStore.user)
const loading = ref(true)
const error = ref<string | null>(null)

const stats = ref<PostStats>({
  postsCount: 0,
  lastPost: null,
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const getCurrentDate = () => {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getUserInitials = () => {
  const name = user.value?.fullName || 'User'
  const names = name.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  }
  return name[0].toUpperCase()
}

const formatMemberSince = () => {
  // Mock data - dans un vrai projet, cela viendrait de l'API
  const memberSince = new Date(2024, 0, 1) // 1er janvier 2024
  return memberSince.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
}

const loadStats = async () => {
  try {
    loading.value = true
    error.value = null
    // Les stats sont maintenant automatiquement filtrées côté backend pour l'utilisateur connecté
    stats.value = await PostsService.getStats()
  } catch (err) {
    error.value = 'Erreur lors du chargement des statistiques'
    console.error('Erreur stats:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadStats()
})
</script>

<style scoped>
.action-card {
  @apply p-6 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer;
}

.action-card:hover {
  @apply transform -translate-y-1;
}

.action-card:active {
  @apply transform translate-y-0;
}

/* Animations d'entrée pour les statistiques */
.stat-card {
  animation: slideInUp 0.6s ease-out;
}

.stat-card:nth-child(1) {
  animation-delay: 0.1s;
}
.stat-card:nth-child(2) {
  animation-delay: 0.2s;
}
.stat-card:nth-child(3) {
  animation-delay: 0.3s;
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
@media (max-width: 640px) {
  .action-card {
    @apply p-4;
  }
}
</style>
