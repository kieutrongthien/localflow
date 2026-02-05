<template>
  <div class="rounded-xl border p-4 transition-colors shadow-sm bg-white hover:bg-gray-50 border-gray-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10" aria-label="Statistic card">
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
defineProps<{ label: string; sublabel?: string; value: number | string }>()
</script>
