<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper'
import { useGameStore } from '@/stores/activity/settingsStore';
import { getRandomWord } from '@/helpers/Activity/wordListHelper';
import { useWordListStore } from '@/stores/activity/wordListStore';

const pushRouter = usePushRouter();

// Initialize the store
const gameStore = useGameStore();

const currentPlayerName = ref('');
const currentPlayerScore = ref(0);
const currentWord = ref('');

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

function continueGame() {
  const state = gameStore.nextPlayer();
  if (state) {
    pushRouter('/activity/done')
  } else {
    pushRouter('/activity/time-up')
  }
}

onMounted(async () => {
  const wordListStore = useWordListStore();
  await wordListStore.init();

  const wordEntry = getRandomWord();

  if (wordEntry && typeof wordEntry !== 'string') {
    currentWord.value = wordEntry.word;
  } else {
    currentWord.value = wordEntry;
  }
});


</script>

<template>
  <h1>Yay! In Game view 🥳</h1>
  <div>
    <h2>Current Stats</h2>
    <p>Current Player: {{ currentPlayerName }}</p>
    <p>Current Points: {{ currentPlayerScore }}</p>
    <p>Current Word: {{ currentWord }}</p>
    <button @click="gameStore.incrementScore(gameStore.getCurrentPlayer?.id)">Increment points</button>
    <button @click="continueGame">Continue</button>
  </div>
</template>
