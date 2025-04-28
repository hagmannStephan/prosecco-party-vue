<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper'

const pushRouter = usePushRouter();
</script>

<template>
  <button @click="pushRouter('/activity/game-config')">
    Go to Activity Config
  </button>
</template>
