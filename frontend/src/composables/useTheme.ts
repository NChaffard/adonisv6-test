import { ref, computed, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const THEME_KEY = 'app-theme'

export const useTheme = () => {
  // Récupérer le thème depuis localStorage ou utiliser 'system' par défaut
  const getStoredTheme = (): Theme => {
    const stored = localStorage.getItem(THEME_KEY)
    return (stored as Theme) || 'system'
  }

  // Détecter la préférence système
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // État réactif du thème
  const theme = ref<Theme>(getStoredTheme())

  // Thème effectif (résout 'system' vers 'light' ou 'dark')
  const effectiveTheme = computed(() => {
    return theme.value === 'system' ? getSystemTheme() : theme.value
  })

  // Appliquer le thème au DOM
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement

    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Changer le thème
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem(THEME_KEY, newTheme)
  }

  // Basculer entre light/dark (ignore system)
  const toggleTheme = () => {
    if (theme.value === 'light') {
      setTheme('dark')
    } else if (theme.value === 'dark') {
      setTheme('light')
    } else {
      // Si system, bascule vers l'opposé du thème système
      setTheme(getSystemTheme() === 'dark' ? 'light' : 'dark')
    }
  }

  // Écouter les changements de thème effectif
  watch(
    effectiveTheme,
    (newTheme) => {
      applyTheme(newTheme)
    },
    { immediate: true }
  )

  // Écouter les changements de préférence système
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme.value === 'system') {
        applyTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // Nettoyage (sera appelé quand le composable est détruit)
    const cleanup = () => {
      mediaQuery.removeEventListener('change', handleChange)
    }

    return {
      theme,
      effectiveTheme,
      setTheme,
      toggleTheme,
      cleanup,
    }
  }

  return {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    cleanup: () => {},
  }
}

// Instance globale pour partager l'état entre les composants
const globalTheme = useTheme()

export default globalTheme
