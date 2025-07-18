<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-lg">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
            </div>
            <div class="ml-3">
              <h1 class="text-lg font-semibold text-gray-900">Admin Panel</h1>
              <p class="text-xs text-gray-500">Gestion système</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-4 space-y-2">
          <button
            v-for="item in navigation"
            :key="item.id"
            @click="$emit('navigate', item.id)"
            :class="[
              'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              activeSection === item.id
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.label }}
            <span
              v-if="item.badge"
              class="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {{ item.badge }}
            </span>
          </button>
        </nav>

        <!-- Footer -->
        <div class="px-4 py-4 border-t border-gray-200">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span class="text-gray-600 font-semibold text-sm">{{ userInitials }}</span>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
              <p class="text-xs text-gray-500">Administrateur</p>
            </div>
            <button
              @click="$emit('logout')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              title="Se déconnecter"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ currentTitle }}</h2>
              <div class="flex items-center mt-1 text-sm text-gray-500">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4"
                  ></path>
                </svg>
                Administration
                <span class="mx-2">•</span>
                {{ currentTitle }}
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-500">
                {{ currentDate }}
              </div>
              <button
                v-if="showCreateButton"
                @click="$emit('create')"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                {{ createButtonText }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto">
        <div class="px-6 py-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface NavigationItem {
  id: string
  label: string
  icon: string
  badge?: string
}

interface Props {
  activeSection: string
  userName: string
  userInitials: string
  navigation: NavigationItem[]
  showCreateButton?: boolean
  createButtonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  showCreateButton: false,
  createButtonText: 'Créer',
})

const emit = defineEmits<{
  navigate: [section: string]
  logout: []
  create: []
}>()

const currentTitle = computed(() => {
  const current = props.navigation.find((item) => item.id === props.activeSection)
  return current?.label || 'Dashboard'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// SVG Components for icons
const DashboardIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4"></path>
    </svg>
  `,
}

const UsersIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
    </svg>
  `,
}

const PostsIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
  `,
}

const AnalyticsIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>
  `,
}

// Register icon components
const iconComponents = {
  DashboardIcon,
  UsersIcon,
  PostsIcon,
  AnalyticsIcon,
}

// Make icons available in template
Object.entries(iconComponents).forEach(([name, component]) => {
  // This is a workaround for dynamic component registration in setup
  globalThis[name] = component
})
</script>

<style scoped>
/* Custom scrollbar for main content */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Sidebar active state animation */
.border-l-4 {
  border-left: 4px solid #3b82f6;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}

/* Responsive design */
@media (max-width: 768px) {
  .w-64 {
    width: 100%;
    position: fixed;
    z-index: 50;
    height: 100vh;
  }
}
</style>
