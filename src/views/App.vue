<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function pushRouter(route: string) {
  console.log('Navigating to:', route);
  router.push({ path: route });
}
</script>

<template>
  <button @click="pushRouter('/activity/game-config')">
    Go to Activity Config
  </button>

  <router-view />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
