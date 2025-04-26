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
</template>