<template>
  <div class="space-y-6">
    <!-- Analytics placeholder -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="text-center py-12">
        <div
          class="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4"
        >
          <svg
            class="h-8 w-8 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Analytics avancés</h3>
        <p class="text-gray-500 mb-6">
          Cette section contiendra des graphiques et des statistiques détaillées.<br />
          Fonctionnalité à implémenter dans une prochaine version.
        </p>
        <div class="bg-blue-50 rounded-lg p-4 text-left">
          <h4 class="font-medium text-blue-900 mb-2">Fonctionnalités prévues :</h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• Graphiques d'évolution des utilisateurs</li>
            <li>• Statistiques des posts par période</li>
            <li>• Métriques d'engagement</li>
            <li>• Rapports d'activité</li>
            <li>• Tableaux de bord personnalisés</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Basic stats for now -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques de base</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Utilisateurs totaux</span>
            <span class="font-medium text-gray-900">{{ stats?.totalUsers || 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Administrateurs</span>
            <span class="font-medium text-gray-900">{{ stats?.adminUsers || 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Utilisateurs standard</span>
            <span class="font-medium text-gray-900">{{ stats?.regularUsers || 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Nouveaux (7 jours)</span>
            <span class="font-medium text-gray-900">{{ stats?.recentUsers || 0 }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Données des posts</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Posts totaux</span>
            <span class="font-medium text-gray-900">{{ totalPosts || 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Posts aujourd'hui</span>
            <span class="font-medium text-gray-900">{{ todayPosts || 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Posts cette semaine</span>
            <span class="font-medium text-gray-900">{{ weekPosts || 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Moyenne mots/post</span>
            <span class="font-medium text-gray-900">{{ avgWordsPerPost || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AdminService, type AdminStats } from '../../services/admin'
import { PostsService, type Post } from '../../services/posts'

// State
const stats = ref<AdminStats | null>(null)
const posts = ref<Post[]>([])

// Computed
const totalPosts = computed(() => posts.value.length)

const todayPosts = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return posts.value.filter((post) => {
    const postDate = new Date(post.createdAt)
    postDate.setHours(0, 0, 0, 0)
    return postDate.getTime() === today.getTime()
  }).length
})

const weekPosts = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return posts.value.filter((post) => {
    const postDate = new Date(post.createdAt)
    return postDate >= weekAgo
  }).length
})

const avgWordsPerPost = computed(() => {
  if (posts.value.length === 0) return 0
  const totalWords = posts.value.reduce((sum, post) => {
    return sum + post.content.split(' ').length
  }, 0)
  return Math.round(totalWords / posts.value.length)
})

// Methods
const loadStats = async () => {
  try {
    stats.value = await AdminService.getStats()
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

const loadPosts = async () => {
  try {
    // Utiliser l'endpoint admin pour récupérer tous les posts
    posts.value = await AdminService.getPosts()
  } catch (error) {
    console.error('Erreur lors du chargement des posts:', error)
  }
}

onMounted(async () => {
  await Promise.all([loadStats(), loadPosts()])
})
</script>
