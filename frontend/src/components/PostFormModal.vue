<template>
  <Modal
    :show="show"
    :title="editingPost ? 'Modifier l\'article' : 'Créer un nouvel article'"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Titre -->
      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Titre <span class="text-red-500">*</span>
          <span class="text-xs text-gray-500 font-normal">(5-200 caractères)</span>
        </label>
        <input
          v-model="form.title"
          type="text"
          required
          maxlength="200"
          placeholder="Entrez le titre de votre article..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500':
              form.title.length > 0 && form.title.trim().length < 5,
            'border-green-300 focus:ring-green-500 focus:border-green-500':
              form.title.trim().length >= 5 && form.title.length <= 200,
          }"
        />
        <div class="flex justify-between mt-1">
          <div class="text-xs text-gray-500">{{ form.title.length }}/200 caractères</div>
          <div
            v-if="form.title.length > 0 && form.title.trim().length < 5"
            class="text-xs text-red-500"
          >
            Minimum 5 caractères requis
          </div>
        </div>
      </div>

      <!-- Contenu -->
      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Contenu <span class="text-red-500">*</span>
          <span class="text-xs text-gray-500 font-normal">(50-10000 caractères)</span>
        </label>
        <textarea
          v-model="form.content"
          required
          rows="8"
          maxlength="10000"
          placeholder="Rédigez le contenu de votre article..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500':
              form.content.length > 0 && form.content.trim().length < 50,
            'border-green-300 focus:ring-green-500 focus:border-green-500':
              form.content.trim().length >= 50 && form.content.length <= 10000,
          }"
        ></textarea>
        <div class="flex justify-between mt-1">
          <div class="text-xs text-gray-500">{{ form.content.length }}/10000 caractères</div>
          <div
            v-if="form.content.length > 0 && form.content.trim().length < 50"
            class="text-xs text-orange-500"
          >
            Minimum 50 caractères requis
          </div>
        </div>
      </div>

      <!-- Progress bar -->
      <div v-if="form.content.length > 0" class="w-full bg-gray-200 rounded-full h-1">
        <div
          class="h-1 rounded-full transition-all duration-300"
          :class="{
            'bg-red-400': contentProgress < 50,
            'bg-yellow-400': contentProgress >= 50 && contentProgress < 100,
            'bg-green-400': contentProgress >= 100,
          }"
          :style="{ width: Math.min(contentProgress, 100) + '%' }"
        ></div>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        @click="handleClose"
        :disabled="loading"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Annuler
      </button>
      <button
        type="button"
        @click="handleSubmit"
        :disabled="loading || !isFormValid"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        <!-- Loading spinner -->
        <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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

        <!-- Success icon -->
        <svg
          v-else-if="!editingPost"
          class="h-4 w-4"
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

        <!-- Edit icon -->
        <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          ></path>
        </svg>

        {{
          loading
            ? editingPost
              ? 'Modification...'
              : 'Création...'
            : editingPost
              ? 'Modifier'
              : 'Créer'
        }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from './Modal.vue'
import { usePostsStore } from '../stores/posts'
import { useNotifications } from '../composables/useNotifications'

interface Props {
  show: boolean
  editingPost?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const postsStore = usePostsStore()
const { success, error } = useNotifications()

const form = ref({
  title: '',
  content: '',
})

const loading = ref(false)

// Validation du formulaire
const isFormValid = computed(() => {
  const title = form.value.title.trim()
  const content = form.value.content.trim()

  return title.length >= 5 && title.length <= 200 && content.length >= 50 && content.length <= 10000
})

// Progress du contenu (basé sur 50 caractères minimum)
const contentProgress = computed(() => {
  const minLength = 50
  return (form.value.content.trim().length / minLength) * 100
})

// Charger les données lors de l'édition
watch(
  () => props.editingPost,
  (newPost) => {
    if (newPost) {
      form.value = {
        title: newPost.title || '',
        content: newPost.content || '',
      }
    }
  },
  { immediate: true }
)

// Réinitialiser le formulaire à l'ouverture/fermeture
watch(
  () => props.show,
  (show) => {
    if (show && !props.editingPost) {
      // Réinitialiser le formulaire pour un nouveau post
      form.value = {
        title: '',
        content: '',
      }
    }

    // Nettoyer les erreurs du store à l'ouverture
    if (show) {
      postsStore.clearError()
      loading.value = false // S'assurer que le loading est réinitialisé
    } else {
      // Réinitialiser le formulaire et l'état de loading quand la modale se ferme
      loading.value = false
      if (!props.editingPost) {
        form.value = {
          title: '',
          content: '',
        }
      }
    }
  }
)

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return

  // Validation côté client
  const title = form.value.title.trim()
  const content = form.value.content.trim()

  if (title.length < 5) {
    error('Titre trop court', 'Le titre doit contenir au moins 5 caractères')
    return
  }

  if (content.length < 50) {
    error('Contenu trop court', 'Le contenu doit contenir au moins 50 caractères')
    return
  }

  loading.value = true

  try {
    let result
    if (props.editingPost) {
      // Mode édition
      result = await postsStore.updatePost(props.editingPost.id, {
        title,
        content,
      })
    } else {
      // Mode création
      result = await postsStore.createPost({
        title,
        content,
      })
    }

    if (result.success) {
      console.log('🟢 PostFormModal: Succès détecté, émission des événements...')

      // Notification de succès
      if (props.editingPost) {
        success('Article modifié !', 'Votre article a été mis à jour avec succès.')
      } else {
        success('Article créé !', 'Votre nouvel article a été publié avec succès.')
      }

      // Réinitialiser le formulaire
      form.value = {
        title: '',
        content: '',
      }

      // Émettre le succès pour déclencher la mise à jour des données et la fermeture
      console.log('🟢 PostFormModal: Émission de success')
      emit('success')
    } else if (result.error) {
      // Notification d'erreur
      error('Erreur', result.error)
    }
  } catch (err) {
    error('Erreur inattendue', 'Une erreur est survenue lors de la sauvegarde.')
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  if (loading.value) return

  // Nettoyer les erreurs du store
  postsStore.clearError()

  emit('close')
}
</script>
