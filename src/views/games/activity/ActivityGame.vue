<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { loadWordList } from '@/helpers/Activity/wordListHelper';
import { usePushRouter } from '@/helpers/routerHelper'
import { useGameStore } from '@/stores/activity/settingsStore';

const pushRouter = usePushRouter();

// Initialize the store
const gameStore = useGameStore();

const currentPlayerName = ref('');
const currentPlayerScore = ref(0);

currentPlayerName.value = gameStore.getCurrentPlayer?.name || 'Unknown Player';
currentPlayerScore.value = gameStore.getScore(gameStore.getCurrentPlayer?.id) || 0;

// Watch for changes in the store's current player and update the score reactively
watch(
  () => gameStore.getScore(gameStore.getCurrentPlayer?.id),
  (newScore) => {
    currentPlayerScore.value = newScore;
  },
  { deep: true }
);

function continueGame () {
  const state = gameStore.nextPlayer();
  if (state) {
    pushRouter('/activity/done')
  } else {
    pushRouter('/activity/time-up')
  }
}

// Create a reactive variable to hold the word list
// const wordList = ref<string[]>([]);
// const isPWA =ref(false);

// onMounted(() => {
//   loadWordList().then((result) => {
//     if (result) {
//       wordList.value = result;
//     }
//   });
//   isPWA.value = window.matchMedia('(display-mode: standalone)').matches || ((navigator as any).standalone == true);
// });
</script>

<template>
  <h1>Yay! In Game view 🥳</h1>
  <div>
    <!-- <h2>Word List</h2>
    <p>Is PWA: {{ isPWA.toString() }}</p>
    <ul>
      <li v-for="(word, index) in wordList" :key="index">{{ word }}</li>
    </ul> -->
    <h2>Current Stats</h2>
    <p>Current Player: {{ currentPlayerName }}</p>
    <p>Current Points: {{ currentPlayerScore }}</p>
    <button @click="gameStore.incrementScore(gameStore.getCurrentPlayer?.id)">Increment points</button>
    <button @click="continueGame">Continue</button>
  </div>
</template>
