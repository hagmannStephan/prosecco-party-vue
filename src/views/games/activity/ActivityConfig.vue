<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/activity/settingsStore';

const pushRouter = usePushRouter();

// Initialize the store
const gameStore = useGameStore();
</script>

<template>
  <h1>Game Config</h1>
  <p>TODO: Implement</p>
  <!-- TODO: Add option to modify wordlist -->
  <!-- TODO: Add option to modify game settings -->
  <button @click="pushRouter('/activity')">Go to Game View</button>
</template>
