<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <nav
      class="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-200"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link
              to="/"
              class="text-xl font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              aria-label="Retour à l'accueil"
            >
              AdonisV6 App
            </router-link>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link
              to="/"
              class="nav-link"
              :class="{ 'nav-link-active': $route.name === 'home' }"
              aria-current="page"
            >
              Accueil
            </router-link>

            <template v-if="!authStore.isAuthenticated">
              <router-link
                to="/login"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'login' }"
              >
                Connexion
              </router-link>
              <router-link to="/register" class="btn-primary ml-3"> Inscription </router-link>

              <!-- Theme Selector -->
              <div class="ml-3">
                <ThemeSelector />
              </div>
            </template>

            <template v-else>
              <router-link
                to="/dashboard"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'dashboard' }"
              >
                Dashboard
              </router-link>
              <router-link
                to="/posts"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'posts' }"
              >
                Articles
              </router-link>

              <!-- Theme Selector -->
              <ThemeSelector />

              <!-- User Menu -->
              <div class="relative ml-4" ref="userMenuRef">
                <button
                  @click="toggleUserMenu"
                  @keydown.escape="closeUserMenu"
                  class="flex items-center space-x-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :aria-expanded="showUserMenu"
                  aria-haspopup="true"
                >
                  <div
                    class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium"
                  >
                    {{ getUserInitials }}
                  </div>
                  <span class="hidden lg:block text-gray-700">
                    {{ authStore.user?.fullName || 'Utilisateur' }}
                  </span>
                  <svg
                    class="w-4 h-4 text-gray-400 transition-transform duration-200"
                    :class="{ 'rotate-180': showUserMenu }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <div
                    v-if="showUserMenu"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <button
                      @click="handleLogout"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:bg-red-50"
                      role="menuitem"
                    >
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          ></path>
                        </svg>
                        <span>Déconnexion</span>
                      </div>
                    </button>
                  </div>
                </Transition>
              </div>
            </template>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button
              @click="toggleMobileMenu"
              class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              :aria-expanded="showMobileMenu"
              aria-label="Menu principal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  v-if="!showMobileMenu"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 bg-white">
            <div class="px-2 pt-2 pb-3 space-y-1">
              <router-link
                to="/"
                @click="closeMobileMenu"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.name === 'home' }"
              >
                Accueil
              </router-link>

              <template v-if="!authStore.isAuthenticated">
                <router-link
                  to="/login"
                  @click="closeMobileMenu"
                  class="mobile-nav-link"
                  :class="{ 'mobile-nav-link-active': $route.name === 'login' }"
                >
                  Connexion
                </router-link>
                <router-link to="/register" @click="closeMobileMenu" class="mobile-nav-link">
                  Inscription
                </router-link>
              </template>

              <template v-else>
                <router-link
                  to="/dashboard"
                  @click="closeMobileMenu"
                  class="mobile-nav-link"
                  :class="{ 'mobile-nav-link-active': $route.name === 'dashboard' }"
                >
                  Dashboard
                </router-link>
                <router-link
                  to="/posts"
                  @click="closeMobileMenu"
                  class="mobile-nav-link"
                  :class="{ 'mobile-nav-link-active': $route.name === 'posts' }"
                >
                  Articles
                </router-link>

                <!-- User info mobile -->
                <div class="px-3 py-2 border-t border-gray-200 mt-3">
                  <div class="flex items-center space-x-3 mb-3">
                    <div
                      class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium"
                    >
                      {{ getUserInitials }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {{ authStore.user?.fullName || 'Utilisateur' }}
                      </p>
                      <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
                    </div>
                  </div>
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    Déconnexion
                  </button>
                </div>
              </template>
            </div>
          </div>
        </Transition>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 px-4">
      <RouterView />
    </main>

    <!-- Système de notifications -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import NotificationContainer from './components/NotificationContainer.vue'
import ThemeSelector from './components/ThemeSelector.vue'

const router = useRouter()
const authStore = useAuthStore()

// États réactifs pour les menus
const showMobileMenu = ref(false)
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

// Computed pour les initiales utilisateur
const getUserInitials = computed(() => {
  const user = authStore.user
  if (!user?.fullName) return 'U'

  const names = user.fullName.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  }
  return user.fullName[0].toUpperCase()
})

// Fonctions de gestion des menus
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    showUserMenu.value = false
  }
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showUserMenu.value) {
    showMobileMenu.value = false
  }
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

// Gestion des clics extérieurs
const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu()
  }
}

// Gestion de l'échappement
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeUserMenu()
    closeMobileMenu()
  }
}

// Cycle de vie
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})

const handleLogout = () => {
  closeUserMenu()
  closeMobileMenu()
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* Navigation Links - Desktop */
.nav-link {
  @apply text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1;
}

.nav-link-active {
  @apply bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800;
}

/* Navigation Links - Mobile */
.mobile-nav-link {
  @apply block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.mobile-nav-link-active {
  @apply bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800;
}

/* Primary Button */
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-link {
    @apply text-base;
  }
}
</style>
