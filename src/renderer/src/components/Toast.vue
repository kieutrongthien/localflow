<template>
  <div v-if="visible" class="fixed bottom-4 right-4 z-50">
    <div :class="boxClass" class="min-w-[260px] rounded-lg px-4 py-3 shadow">
      <div class="flex items-start gap-2">
        <span class="font-semibold">{{ title }}</span>
        <button class="ml-auto text-sm text-white/70" @click="hide">×</button>
      </div>
      <p class="text-sm mt-1">{{ message }}</p>
    </div>
  </div>
  <div v-if="visible" class="fixed inset-0" @click="hide"></div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{ type?: 'success' | 'error' | 'info'; title?: string; message: string; duration?: number }>()
const emit = defineEmits<{ (e: 'hidden'): void }>()

const visible = ref(true)
const title = computed(() => props.title ?? (props.type === 'error' ? 'Lỗi' : props.type === 'success' ? 'Thành công' : 'Thông báo'))
const boxClass = computed(() => {
  switch (props.type) {
    case 'error': return 'bg-red-500 text-white'
    case 'success': return 'bg-emerald-500 text-slate-900'
    default: return 'bg-zinc-800 text-white'
  }
})

const hide = () => { visible.value = false; emit('hidden') }

onMounted(() => {
  const ms = props.duration ?? 3000
  if (ms > 0) setTimeout(hide, ms)
})
</script>

