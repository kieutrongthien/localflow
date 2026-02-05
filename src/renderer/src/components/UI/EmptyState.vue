<template>
  <div :class="['rounded-xl border p-4 text-sm', dark ? 'border-white/10 bg-white/5 text-zinc-400' : 'border-gray-200 bg-white text-gray-600']">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ dark?: boolean }>()
</script>
