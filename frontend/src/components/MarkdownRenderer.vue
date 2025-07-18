<template>
  <div class="markdown-renderer">
    <v-md-preview :text="content" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string
}

defineProps<Props>()
</script>

<style scoped>
.markdown-renderer {
  width: 100%;
}

/* Laisser les styles GitHub natifs s'appliquer */
.markdown-renderer :deep(.v-md-editor-preview) {
  background: transparent;
  padding: 0;
}

/* Assurer que les styles GitHub sont prioritaires */
.markdown-renderer :deep(.github-markdown-body) {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

/* Réinitialiser les styles Tailwind qui pourraient interférer */
.markdown-renderer :deep(.v-md-editor-preview *) {
  box-sizing: border-box;
}

.markdown-renderer :deep(.v-md-editor-preview h1),
.markdown-renderer :deep(.v-md-editor-preview h2),
.markdown-renderer :deep(.v-md-editor-preview h3),
.markdown-renderer :deep(.v-md-editor-preview h4),
.markdown-renderer :deep(.v-md-editor-preview h5),
.markdown-renderer :deep(.v-md-editor-preview h6) {
  color: inherit;
  font-weight: inherit;
  line-height: inherit;
  border: inherit;
  margin: inherit;
  padding: inherit;
}
</style>
