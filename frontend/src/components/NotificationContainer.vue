<template>
  <Teleport to="body">
    <div class="notification-container">
      <TransitionGroup
        name="notification"
        tag="div"
        class="space-y-3"
        appear
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div
          v-for="(notification, index) in notifications"
          :key="notification.id"
          :data-index="index"
          :class="notificationClasses(notification.type)"
          class="notification-toast"
          role="alert"
          :aria-live="notification.type === 'error' ? 'assertive' : 'polite'"
          :aria-atomic="true"
        >
          <div class="flex items-start">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <component
                :is="getIcon(notification.type)"
                :class="iconClasses(notification.type)"
                :aria-hidden="true"
              />
            </div>

            <!-- Content -->
            <div class="ml-3 flex-1">
              <h4 :class="titleClasses(notification.type)">
                {{ notification.title }}
              </h4>
              <p v-if="notification.message" :class="messageClasses(notification.type)">
                {{ notification.message }}
              </p>
            </div>

            <!-- Close button -->
            <div class="ml-4 flex-shrink-0">
              <button
                @click="removeNotification(notification.id)"
                :class="closeButtonClasses(notification.type)"
                class="close-button"
                :aria-label="`Fermer la notification: ${notification.title}`"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotifications } from '../composables/useNotifications'

const { notifications, removeNotification } = useNotifications()

// Hooks d'animation pour les notifications
const onBeforeEnter = (el: Element) => {
  const element = el as HTMLElement
  const index = parseInt(element.dataset.index || '0')

  // Animation avec délai staggeré
  element.style.opacity = '0'
  element.style.transform = 'translateX(100%) scale(0.8)'
  element.style.transitionDelay = `${index * 0.1}s`
}

const onEnter = (el: Element, done: () => void) => {
  const element = el as HTMLElement

  // Force reflow pour s'assurer que les styles sont appliqués
  element.offsetHeight

  // Animation d'entrée
  element.style.opacity = '1'
  element.style.transform = 'translateX(0) scale(1)'
  element.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'

  // Callback après animation
  setTimeout(done, 400)
}

const onLeave = (el: Element, done: () => void) => {
  const element = el as HTMLElement

  // Animation de sortie
  element.style.opacity = '0'
  element.style.transform = 'translateX(100%) scale(0.8)'
  element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'

  // Callback après animation
  setTimeout(done, 300)
}

// Success Icon
const SuccessIcon = {
  template: `
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
    </svg>
  `,
}

// Error Icon
const ErrorIcon = {
  template: `
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
    </svg>
  `,
}

// Warning Icon
const WarningIcon = {
  template: `
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
    </svg>
  `,
}

// Info Icon
const InfoIcon = {
  template: `
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
    </svg>
  `,
}

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return SuccessIcon
    case 'error':
      return ErrorIcon
    case 'warning':
      return WarningIcon
    case 'info':
      return InfoIcon
    default:
      return InfoIcon
  }
}

const notificationClasses = (type: string) => {
  const base =
    'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden backdrop-blur-sm'

  switch (type) {
    case 'success':
      return `${base} bg-green-50/95 border-green-200 shadow-green-100/50`
    case 'error':
      return `${base} bg-red-50/95 border-red-200 shadow-red-100/50`
    case 'warning':
      return `${base} bg-yellow-50/95 border-yellow-200 shadow-yellow-100/50`
    case 'info':
      return `${base} bg-blue-50/95 border-blue-200 shadow-blue-100/50`
    default:
      return `${base} bg-white/95 border-gray-200 shadow-gray-100/50`
  }
}

const iconClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
    default:
      return 'text-gray-400'
  }
}

const titleClasses = (type: string) => {
  const base = 'text-sm font-semibold'

  switch (type) {
    case 'success':
      return `${base} text-green-800`
    case 'error':
      return `${base} text-red-800`
    case 'warning':
      return `${base} text-yellow-800`
    case 'info':
      return `${base} text-blue-800`
    default:
      return `${base} text-gray-900`
  }
}

const messageClasses = (type: string) => {
  const base = 'mt-1 text-sm'

  switch (type) {
    case 'success':
      return `${base} text-green-700`
    case 'error':
      return `${base} text-red-700`
    case 'warning':
      return `${base} text-yellow-700`
    case 'info':
      return `${base} text-blue-700`
    default:
      return `${base} text-gray-500`
  }
}

const closeButtonClasses = (type: string) => {
  const base =
    'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200'

  switch (type) {
    case 'success':
      return `${base} text-green-500 hover:bg-green-100 focus:ring-green-500`
    case 'error':
      return `${base} text-red-500 hover:bg-red-100 focus:ring-red-500`
    case 'warning':
      return `${base} text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-500`
    case 'info':
      return `${base} text-blue-500 hover:bg-blue-100 focus:ring-blue-500`
    default:
      return `${base} text-gray-400 hover:bg-gray-100 focus:ring-gray-500`
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  max-width: 24rem;
  pointer-events: none;
}

.notification-toast {
  padding: 1rem;
  margin-bottom: 0.75rem;
  pointer-events: auto;
  will-change: transform, opacity;
}

.close-button {
  transition: all 0.2s ease-in-out;
}

.close-button:hover {
  transform: scale(1.1);
}

.close-button:active {
  transform: scale(0.95);
}

/* Responsive design */
@media (max-width: 640px) {
  .notification-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }

  .notification-toast {
    margin-bottom: 0.5rem;
  }
}

/* Animations CSS fallback pour navigateurs sans support JS */
.notification-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effet de glissement pour les notifications qui se repositionnent */
.notification-leave-active {
  position: absolute;
  right: 0;
  width: 100%;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .notification-container {
    /* Support pour le dark mode si nécessaire */
  }
}

/* Réduit les animations pour les utilisateurs qui préfèrent */
@media (prefers-reduced-motion: reduce) {
  .notification-enter-active,
  .notification-leave-active,
  .notification-move,
  .close-button {
    transition: none !important;
    animation: none !important;
  }
}
</style>
