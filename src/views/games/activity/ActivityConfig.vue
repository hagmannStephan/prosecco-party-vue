<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/activity/settingsStore';

const pushRouter = usePushRouter();

// Initialize the store
const gameStore = useGameStore();

// TODO: Replace with actual game settings defined by user with a form
const gameSettings = ref({
  players: ['John', 'Alice'],
  rounds: 5,
  timePerRound: 60,
  gameModes: ['normal', 'hard'],
});

onMounted(() => {
  // Set settings in the store
  gameStore.setGameSettings(gameSettings.value);
})
</script>

<template>
  <h1>Game Config</h1>
  <h2>Game Settings</h2>
  <p>Players: {{ gameStore.getPlayers?.join(', ') || 'None' }}</p>
  <p>Rounds: {{ gameStore.getRounds || 0 }}</p>
  <p>Time per Round: {{ gameStore.getTimePerRound || 0 }} seconds</p>
  <p>Game Modes: {{ gameStore.getGameModes?.join(', ') || 'None' }}</p>
  <!-- TODO: Add option to modify wordlist -->
  <button @click="pushRouter('/activity')">Go to Game View</button>
</template>
