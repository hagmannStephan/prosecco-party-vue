<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadWordList } from '@/helpers/Activity/wordListHelper';
import { usePushRouter } from '@/helpers/routerHelper'
import { useGameStore } from '@/stores/activity/settingsStore';

const pushRouter = usePushRouter();

// Initialize the store
const gameStore = useGameStore();

// Access game settings from the store
const players = gameStore.getPlayers;
const rounds = gameStore.getRounds;
const timePerRound = gameStore.getTimePerRound;
const gameModes = gameStore.getGameModes;

// Create a reactive variable to hold the word list
const wordList = ref<string[]>([]);
const isPWA =ref(false);

onMounted(() => {
  loadWordList().then((result) => {
    if (result) {
      wordList.value = result;
    }
  });
  isPWA.value = window.matchMedia('(display-mode: standalone)').matches || ((navigator as any).standalone == true);
});
</script>

<template>
  <h1>Yay! In Game view 🥳</h1>
  <div>
    <h2>Word List</h2>
    <p>Is PWA: {{ isPWA.toString() }}</p>
    <ul>
      <!-- Render the word list dynamically -->
      <li v-for="(word, index) in wordList" :key="index">{{ word }}</li>
    </ul>
    <h2>User Settings</h2>
    <p>Players: {{ players?.map(player => player.name).join(', ') || 'None' }}</p>
    <p>Rounds: {{ rounds }}</p>
    <p>Time per Round: {{ timePerRound }} seconds</p>
    <p>Game Modes: {{ gameModes.join(', ') }}</p>
    <button @click="pushRouter('/')">Go to Home</button>
    <!-- TODO: Clear setting once done -->
    <!-- TODO: Redirect to activity Config if empty or use standard values -->
  </div>
</template>
