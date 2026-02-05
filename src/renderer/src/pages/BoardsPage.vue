<template>
  <div class="space-y-4">
    <UICard :dark="true" class="p-4">
      <h3 class="mb-2">Boards</h3>
      <p class="text-zinc-400 text-sm">Kéo thả Story giữa các cột trong trang App.vue. Trang này sẽ nhận chuyển giao ở bước tiếp theo.</p>
      <div class="mt-2">
        <UIButton variant="secondary" aria-label="Open Boards in main view" @click="goBoards">Mở Boards chính</UIButton>
      </div>
    </UICard>
  </div>
</template>

<script setup lang="ts">
import UIButton from '../components/UI/Button.vue'
import UICard from '../components/UI/Card.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const goBoards = () => router.push('/boards')
</script>
