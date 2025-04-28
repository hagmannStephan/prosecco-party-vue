<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/activity/settingsStore';

const pushRouter = usePushRouter();

// Initialize the store
const gameStore = useGameStore();

// TODO: Replace with actual game settings defined by user with a form
const gameSettings = ref({
  players: [
    { id: 1, name: 'Steff de Chef', score: 0},
    { id: 2, name: 'Liam de Lappe', score: 0}
  ],
  rounds: 3,
  timePerRound: 60,
  gameModes: ['normal', 'hard'],
  currentRound: 0,
  currentPlayer: 0,
});

onMounted(() => {
  // Set settings in the store
  gameStore.setGameSettings(gameSettings.value);
})
</script>

<template>
  <h1>Game Config</h1>
  <h2>Game Settings</h2>
  <p>Players: {{ gameStore.getPlayers?.map(player => player.name).join(', ') || 'None' }}</p>
  <p>Rounds: {{ gameStore.getRounds || 0 }}</p>
  <p>Time per Round: {{ gameStore.getTimePerRound || 0 }} seconds</p>
  <p>Game Modes: {{ gameStore.getGameModes?.join(', ') || 'None' }}</p>
  <!-- TODO: Add option to modify wordlist -->
  <button @click="pushRouter('/activity/break')">Go to Activity Break</button>
</template>
