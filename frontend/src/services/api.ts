import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes de timeout
})

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs de réseau
    if (!error.response) {
      console.error('Erreur réseau:', error.message)
      return Promise.reject({
        response: {
          data: { message: 'Erreur de connexion au serveur' },
          status: 0,
        },
      })
    }

    // Gérer les erreurs d'authentification
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Émettre un événement pour que l'application gère la déconnexion
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }

    // Gérer les erreurs CORS
    if (error.response?.status === 0 || error.code === 'ERR_NETWORK') {
      console.error('Erreur CORS ou réseau détectée')
      return Promise.reject({
        response: {
          data: { message: 'Problème de connexion (CORS ou réseau)' },
          status: 0,
        },
      })
    }

    // Gérer les erreurs de validation (422)
    if (error.response?.status === 422) {
      console.error('Erreur de validation:', error.response.data)
    }

    // Gérer les erreurs serveur (500)
    if (error.response?.status >= 500) {
      console.error('Erreur serveur:', error.response.data)
      return Promise.reject({
        response: {
          data: { message: 'Erreur interne du serveur' },
          status: error.response.status,
        },
      })
    }

    return Promise.reject(error)
  }
)

export default api
