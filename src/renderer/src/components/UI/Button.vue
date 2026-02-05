<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 shadow-sm',
      variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-400' : '',
      variant === 'secondary' ? 'bg-white text-zinc-900 hover:bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-white/10 dark:text-white dark:border-white/10 dark:hover:bg-white/20' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ variant?: 'primary' | 'secondary'; disabled?: boolean; ariaLabel?: string }>()
</script>
