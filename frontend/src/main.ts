import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import globalTheme from './composables/useTheme'
import './style.css'

// Import Vue Markdown Editor (Preview only)
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// Use GitHub theme for Markdown Preview
VMdPreview.use(githubTheme)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VMdPreview)

// Initialiser l'état d'authentification
const authStore = useAuthStore()

// Initialiser le thème global
globalTheme

// Écouter l'événement de déconnexion depuis l'API
window.addEventListener('auth:logout', () => {
  authStore.logout()
  router.push('/login')
})

// Vérifier l'utilisateur au démarrage si un token existe
if (authStore.token) {
  authStore.fetchUser().catch(() => {
    // Token invalide, ne rien faire car fetchUser gère déjà la déconnexion
  })
}

app.mount('#app')
