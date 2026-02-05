<template>
  <span :class="['inline-flex items-center rounded-full px-2 py-1 text-xs border',
    color==='blue'?'bg-white/10 border-white/10 text-blue-300':'bg-white/10 border-white/10 text-zinc-300']">
    <slot />
  </span>
</template>
<script setup lang="ts">
defineProps<{ color?: 'blue'|'default' }>()
</script>
