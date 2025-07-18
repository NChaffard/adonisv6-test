<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h2>
        <p class="text-gray-600">Rejoignez notre plateforme et commencez dès maintenant</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-semibold text-gray-700 mb-2">
              Nom complet
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
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
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                required
                autocomplete="name"
                placeholder="Votre nom complet"
                class="auth-input pl-10"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500': fieldErrors.fullName,
                }"
              />
            </div>
            <Transition
              name="error"
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 transform scale-95"
              enter-to-class="opacity-100 transform scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 transform scale-100"
              leave-to-class="opacity-0 transform scale-95"
            >
              <div v-if="fieldErrors.fullName" class="mt-2 text-sm text-red-600">
                {{ fieldErrors.fullName }}
              </div>
            </Transition>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Adresse email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  ></path>
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                placeholder="nom@exemple.com"
                class="auth-input pl-10"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500': fieldErrors.email,
                }"
              />
            </div>
            <Transition
              name="error"
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 transform scale-95"
              enter-to-class="opacity-100 transform scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 transform scale-100"
              leave-to-class="opacity-0 transform scale-95"
            >
              <div v-if="fieldErrors.email" class="mt-2 text-sm text-red-600">
                {{ fieldErrors.email }}
              </div>
            </Transition>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                placeholder="Votre mot de passe"
                class="auth-input pl-10 pr-10"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500': fieldErrors.password,
                }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="!showPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    v-if="!showPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              </button>
            </div>
            <Transition
              name="error"
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 transform scale-95"
              enter-to-class="opacity-100 transform scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 transform scale-100"
              leave-to-class="opacity-0 transform scale-95"
            >
              <div v-if="fieldErrors.password" class="mt-2 text-sm text-red-600">
                {{ fieldErrors.password }}
              </div>
            </Transition>
          </div>

          <!-- Password Confirmation -->
          <div>
            <label
              for="passwordConfirmation"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              Confirmer le mot de passe
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <input
                id="passwordConfirmation"
                v-model="form.passwordConfirmation"
                :type="showPasswordConfirmation ? 'text' : 'password'"
                required
                autocomplete="new-password"
                placeholder="Confirmez votre mot de passe"
                class="auth-input pl-10 pr-10"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500':
                    fieldErrors.passwordConfirmation,
                }"
              />
              <button
                type="button"
                @click="showPasswordConfirmation = !showPasswordConfirmation"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="!showPasswordConfirmation"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    v-if="!showPasswordConfirmation"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              </button>
            </div>
            <Transition
              name="error"
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 transform scale-95"
              enter-to-class="opacity-100 transform scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 transform scale-100"
              leave-to-class="opacity-0 transform scale-95"
            >
              <div v-if="fieldErrors.passwordConfirmation" class="mt-2 text-sm text-red-600">
                {{ fieldErrors.passwordConfirmation }}
              </div>
            </Transition>
          </div>

          <!-- Error Message -->
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
              class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center"
            >
              <svg
                class="h-5 w-5 text-red-400 mr-2"
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
              <span class="text-red-700 text-sm">{{ error }}</span>
            </div>
          </Transition>

          <!-- Submit Button -->
          <button type="submit" :disabled="loading" class="auth-button group">
            <svg v-if="loading" class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
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

            <svg
              v-else
              class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>

            {{ loading ? 'Inscription en cours...' : "S'inscrire" }}
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6 text-center">
          <span class="text-gray-500 text-sm"> Déjà un compte ? </span>
          <router-link
            to="/login"
            class="ml-2 text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline transition-colors"
          >
            Se connecter
          </router-link>
        </div>
      </div>

      <!-- Back to home -->
      <div class="text-center">
        <router-link
          to="/"
          class="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center transition-colors"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const fieldErrors = ref({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const clearErrors = () => {
  error.value = ''
  fieldErrors.value = {
    fullName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  }
}

const handleRegister = async () => {
  loading.value = true
  clearErrors()

  if (form.value.password !== form.value.passwordConfirmation) {
    fieldErrors.value.passwordConfirmation = 'Les mots de passe ne correspondent pas'
    loading.value = false
    return
  }

  try {
    const result = await authStore.register({
      fullName: form.value.fullName,
      email: form.value.email,
      password: form.value.password,
    })

    if (result.success) {
      router.push('/dashboard')
    } else {
      // Gérer les erreurs de validation du serveur
      if (result.errors && typeof result.errors === 'object') {
        Object.keys(result.errors).forEach((field) => {
          if (Object.prototype.hasOwnProperty.call(fieldErrors.value, field)) {
            fieldErrors.value[field] = Array.isArray(result.errors[field])
              ? result.errors[field][0]
              : result.errors[field]
          }
        })
      } else {
        error.value = result.error || "Erreur lors de l'inscription"
      }
    }
  } catch (err) {
    error.value = "Erreur lors de l'inscription"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-input {
  @apply block w-full rounded-lg border-gray-300 bg-gray-50 px-3 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm;
}

.auth-button {
  @apply w-full flex justify-center items-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
}

.auth-button:hover:not(:disabled) {
  @apply shadow-lg transform -translate-y-0.5;
}

.auth-button:active:not(:disabled) {
  @apply transform translate-y-0;
}

/* Loading state */
.auth-button:disabled {
  @apply bg-blue-400 cursor-not-allowed;
}

/* Error state focus */
.auth-input:focus {
  @apply ring-2 ring-offset-2;
}
</style>
