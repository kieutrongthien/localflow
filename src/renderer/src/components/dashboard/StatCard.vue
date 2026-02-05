<template>
  <div :class="['rounded-xl border p-4 transition-colors', dark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white']" aria-label="Statistic card">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <slot name="icon"></slot>
        <div class="text-sm text-zinc-400">{{ label }}</div>
      </div>
      <div class="text-xs text-zinc-400">{{ sublabel }}</div>
    </div>
    <div class="mt-2 text-3xl font-semibold">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; sublabel?: string; value: number | string; dark?: boolean }>()
</script>
