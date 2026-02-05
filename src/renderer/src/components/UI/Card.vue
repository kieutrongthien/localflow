<template>
  <div :class="['rounded-xl border p-4', dark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white']">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ dark?: boolean }>()
</script>
