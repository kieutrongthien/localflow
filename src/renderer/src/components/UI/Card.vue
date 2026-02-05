<template>
  <div :class="['rounded-xl border p-4 transition-colors', dark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50']">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ dark?: boolean }>()
</script>
