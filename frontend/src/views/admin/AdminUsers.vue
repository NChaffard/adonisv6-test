<template>
  <div class="space-y-6">
    <!-- Users Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div v-if="usersLoading" class="p-6">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="w-20 h-6 bg-gray-200 rounded"></div>
            <div class="w-24 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="users.length === 0" class="p-8 text-center">
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur</h3>
        <p class="mt-1 text-sm text-gray-500">Commencez par créer un nouvel utilisateur.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Utilisateur
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rôle
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Créé le
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-semibold text-sm">{{
                      getUserInitials(user.fullName)
                    }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.fullName }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800',
                  ]"
                >
                  {{ user.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  @click="editUser(user)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Modifier
                </button>
                <button
                  v-if="user.id !== authStore.user?.id"
                  @click="toggleUserRole(user)"
                  :class="[
                    'transition-colors',
                    user.role === 'admin'
                      ? 'text-orange-600 hover:text-orange-900'
                      : 'text-purple-600 hover:text-purple-900',
                  ]"
                >
                  {{ user.role === 'admin' ? 'Rétrograder' : 'Promouvoir' }}
                </button>
                <button
                  v-if="user.id !== authStore.user?.id"
                  @click="confirmDeleteUser(user)"
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

    <!-- Create User Modal -->
    <Modal v-model="showCreateModal" title="Créer un nouvel utilisateur">
      <form @submit.prevent="createUser" class="space-y-4">
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700">Nom complet</label>
          <input
            id="fullName"
            v-model="createForm.fullName"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="createForm.email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            id="password"
            v-model="createForm.password"
            type="password"
            required
            minlength="8"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Rôle</label>
          <select
            id="role"
            v-model="createForm.role"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="showCreateModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="createLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ createLoading ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Edit User Modal -->
    <Modal v-model="showEditModal" title="Modifier l'utilisateur">
      <form @submit.prevent="updateUser" class="space-y-4">
        <div>
          <label for="editFullName" class="block text-sm font-medium text-gray-700"
            >Nom complet</label
          >
          <input
            id="editFullName"
            v-model="editForm.fullName"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="editEmail" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="editEmail"
            v-model="editForm.email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="editRole" class="block text-sm font-medium text-gray-700">Rôle</label>
          <select
            id="editRole"
            v-model="editForm.role"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="showEditModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="editLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ editLoading ? 'Modification...' : 'Modifier' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Confirmer la suppression">
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Êtes-vous sûr de vouloir supprimer l'utilisateur
          <strong>{{ userToDelete?.fullName }}</strong> ?
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
            @click="deleteUser"
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
import { useAuthStore } from '../../stores/auth'
import {
  AdminService,
  type UserData,
  type CreateUserData,
  type UpdateUserData,
} from '../../services/admin'
import Modal from '../../components/Modal.vue'

const emit = defineEmits<{
  message: [message: string, type: 'success' | 'error']
}>()

const authStore = useAuthStore()

// State
const usersLoading = ref(true)
const users = ref<UserData[]>([])

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Forms
const createForm = ref<CreateUserData>({
  fullName: '',
  email: '',
  password: '',
  role: 'user',
})

const editForm = ref<UpdateUserData>({
  fullName: '',
  email: '',
  role: 'user',
})

const userToEdit = ref<UserData | null>(null)
const userToDelete = ref<UserData | null>(null)

// Loading states
const createLoading = ref(false)
const editLoading = ref(false)
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

const loadUsers = async () => {
  try {
    usersLoading.value = true
    const response = await AdminService.getUsers()
    users.value = response.users
  } catch (error: any) {
    emit(
      'message',
      error.response?.data?.message || 'Erreur lors du chargement des utilisateurs',
      'error'
    )
  } finally {
    usersLoading.value = false
  }
}

const createUser = async () => {
  try {
    createLoading.value = true
    const response = await AdminService.createUser(createForm.value)
    users.value.unshift(response.user)
    emit('message', response.message, 'success')
    showCreateModal.value = false
    createForm.value = { fullName: '', email: '', password: '', role: 'user' }
  } catch (error: any) {
    emit('message', error.response?.data?.message || 'Erreur lors de la création', 'error')
  } finally {
    createLoading.value = false
  }
}

const editUser = (user: UserData) => {
  userToEdit.value = user
  editForm.value = {
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  }
  showEditModal.value = true
}

const updateUser = async () => {
  if (!userToEdit.value) return

  try {
    editLoading.value = true
    const response = await AdminService.updateUser(userToEdit.value.id, editForm.value)
    const index = users.value.findIndex((u) => u.id === userToEdit.value!.id)
    if (index !== -1) {
      users.value[index] = response.user
    }
    emit('message', response.message, 'success')
    showEditModal.value = false
  } catch (error: any) {
    emit('message', error.response?.data?.message || 'Erreur lors de la modification', 'error')
  } finally {
    editLoading.value = false
  }
}

const confirmDeleteUser = (user: UserData) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const deleteUser = async () => {
  if (!userToDelete.value) return

  try {
    deleteLoading.value = true
    const response = await AdminService.deleteUser(userToDelete.value.id)
    users.value = users.value.filter((u) => u.id !== userToDelete.value!.id)
    emit('message', response.message, 'success')
    showDeleteModal.value = false
    userToDelete.value = null
  } catch (error: any) {
    emit('message', error.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    deleteLoading.value = false
  }
}

const toggleUserRole = async (user: UserData) => {
  const newRole = user.role === 'admin' ? 'user' : 'admin'

  try {
    const response = await AdminService.changeUserRole(user.id, newRole)
    const index = users.value.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      users.value[index] = response.user
    }
    emit('message', response.message, 'success')
  } catch (error: any) {
    emit('message', error.response?.data?.message || 'Erreur lors du changement de rôle', 'error')
  }
}

// Expose methods to parent
defineExpose({
  showCreateModal: () => {
    showCreateModal.value = true
  },
})

onMounted(() => {
  loadUsers()
})
</script>
