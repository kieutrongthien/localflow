<template>
  <span :class="['inline-flex items-center rounded-full px-2 py-0.5 text-xs',
    variant==='green'?'bg-emerald-500/20 text-emerald-400':
    variant==='blue'?'bg-blue-500/20 text-blue-300':'bg-white/10 text-zinc-300']">
    <slot />
  </span>
</template>
<script setup lang="ts">
defineProps<{ variant?: 'green'|'blue'|'default' }>()
</script>
