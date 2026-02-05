<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
      variant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400' : '',
      variant === 'secondary' ? 'bg-white/10 text-white hover:bg-white/20 focus:ring-2 focus:ring-white/30' : '',
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
