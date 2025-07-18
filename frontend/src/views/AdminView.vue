<template>
  <AdminLayout
    :active-section="activeSection"
    :user-name="authStore.user?.fullName || 'Admin'"
    :user-initials="getUserInitials(authStore.user?.fullName || 'Admin')"
    :navigation="navigation"
    :show-create-button="activeSection === 'users'"
    create-button-text="Nouvel utilisateur"
    @navigate="handleNavigate"
    @logout="handleLogout"
    @create="handleCreate"
  >
    <!-- Error/Success Messages -->
    <Transition
      name="alert"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
    >
      <div
        v-if="message"
        :class="[
          'rounded-lg p-4 mb-6 flex items-center',
          messageType === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200',
        ]"
      >
        <svg
          v-if="messageType === 'success'"
          class="h-5 w-5 text-green-400 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
        <svg
          v-else
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
          <p
            :class="messageType === 'success' ? 'text-green-700' : 'text-red-700'"
            class="font-medium"
          >
            {{ message }}
          </p>
        </div>
        <button @click="clearMessage" class="ml-4">
          <svg
            class="w-4 h-4"
            :class="messageType === 'success' ? 'text-green-400' : 'text-red-400'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Component Sections -->
    <AdminDashboard v-if="activeSection === 'dashboard'" @navigate="handleNavigate" />

    <AdminUsers v-if="activeSection === 'users'" ref="usersComponent" @message="showMessage" />

    <AdminPosts v-if="activeSection === 'posts'" @message="showMessage" />

    <AdminAnalytics v-if="activeSection === 'analytics'" />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminLayout from '../components/admin/AdminLayout.vue'
import AdminDashboard from './admin/AdminDashboard.vue'
import AdminUsers from './admin/AdminUsers.vue'
import AdminPosts from './admin/AdminPosts.vue'
import AdminAnalytics from './admin/AdminAnalytics.vue'

const router = useRouter()
const authStore = useAuthStore()

// State
const activeSection = ref('dashboard')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const usersComponent = ref<any>(null)

// Navigation configuration
const navigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'DashboardIcon',
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: 'UsersIcon',
  },
  {
    id: 'posts',
    label: 'Posts',
    icon: 'PostsIcon',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'AnalyticsIcon',
  },
]

// Methods
const getUserInitials = (fullName: string) => {
  const names = fullName.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  }
  return fullName[0].toUpperCase()
}

const clearMessage = () => {
  message.value = ''
}

const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(clearMessage, 5000)
}

const handleNavigate = (section: string) => {
  activeSection.value = section
  clearMessage()
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleCreate = () => {
  if (activeSection.value === 'users' && usersComponent.value) {
    usersComponent.value.showCreateModal()
  }
}
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
