<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Bienvenue sur notre
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              plateforme
            </span>
          </h1>
          <p class="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Gérez vos utilisateurs et publications avec une interface moderne
            <span class="block mt-2 text-lg text-gray-500">
              Propulsé par AdonisJS v6 + Vue.js 3
            </span>
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link v-if="!authStore.isAuthenticated" to="/register" class="btn-primary-large">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Commencer gratuitement
            </router-link>

            <router-link v-else to="/dashboard" class="btn-primary-large">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              Accéder au dashboard
            </router-link>

            <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn-secondary-large">
              Se connecter
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités principales
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les outils puissants qui vous permettront de gérer votre contenu efficacement
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Authentification -->
          <div class="feature-card group">
            <div class="feature-icon bg-blue-500 group-hover:bg-blue-600">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Authentification sécurisée</h3>
            <p class="text-gray-600 mb-4">
              Système d'authentification robuste avec tokens d'accès et gestion des sessions
            </p>
            <router-link to="/login" class="feature-link">
              Se connecter
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </router-link>
          </div>

          <!-- Gestion des posts -->
          <div class="feature-card group">
            <div class="feature-icon bg-green-500 group-hover:bg-green-600">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Gestion des publications</h3>
            <p class="text-gray-600 mb-4">
              Créez, modifiez et gérez vos publications avec une interface intuitive
            </p>
            <router-link to="/posts" class="feature-link">
              Voir les posts
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </router-link>
          </div>

          <!-- Dashboard -->
          <div class="feature-card group">
            <div class="feature-icon bg-indigo-500 group-hover:bg-indigo-600">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Dashboard personnalisé</h3>
            <p class="text-gray-600 mb-4">
              Tableau de bord avec statistiques et aperçu de votre activité
            </p>
            <router-link v-if="authStore.isAuthenticated" to="/dashboard" class="feature-link">
              Accéder au dashboard
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </router-link>
            <span v-else class="text-gray-400 text-sm"> Connectez-vous pour accéder </span>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">Prêt à commencer ?</h2>
        <p class="text-xl text-blue-100 mb-8">
          Rejoignez notre plateforme et commencez à gérer vos contenus dès maintenant
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg"
          >
            Créer un compte
          </router-link>
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
          >
            Se connecter
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.btn-primary-large {
  @apply bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center;
}

.btn-secondary-large {
  @apply border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center;
}

.feature-card {
  @apply bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100;
}

.feature-icon {
  @apply w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300;
}

.feature-link {
  @apply text-blue-600 hover:text-blue-700 font-medium inline-flex items-center transition-colors duration-200;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card {
  animation: fadeInUp 0.6s ease-out;
}

.feature-card:nth-child(1) {
  animation-delay: 0.1s;
}
.feature-card:nth-child(2) {
  animation-delay: 0.2s;
}
.feature-card:nth-child(3) {
  animation-delay: 0.3s;
}
</style>
