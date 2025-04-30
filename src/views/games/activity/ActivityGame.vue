<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
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
const timeRemaining = ref(0);
const timerInterval = ref<number | null>(null);

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

function getNewWord() {
  const wordEntry = getRandomWord();

  if (wordEntry && typeof wordEntry !== 'string') {
    currentWord.value = wordEntry.word;
  } else {
    currentWord.value = wordEntry;
  }
  // TODO: Display similar words if mode is describe
}

function continueGame() {
  const state = gameStore.nextPlayer();
  if (state) {
    pushRouter('/activity/done')
  } else {
    pushRouter('/activity/time-up')
  }
}

function incrementScore() {
  gameStore.incrementScore(gameStore.getCurrentPlayer?.id);
  getNewWord();
}

function startTimer() {
  // Get the configured time from the store
  const timePerRound = gameStore.getTimePerRound;
  timeRemaining.value = timePerRound;
  
  // Update timer every second
    timerInterval.value = setInterval(() => {
    timeRemaining.value--;
    
    // When time is up, proceed to next player
    if (timeRemaining.value <= 0) {
      if (timerInterval.value !== null) {
        clearInterval(timerInterval.value);
      }
      continueGame();
    }
  }, 1000);
}

onMounted(async () => {
  const wordListStore = useWordListStore();
  await wordListStore.init();

  getNewWord();
  startTimer(); 
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<template>
  <h1>Yay! In Game view 🥳</h1>
  <div>
    <h2>Current Stats</h2>
    <p>Time Remaining: {{ timeRemaining }} seconds</p>
    <p>Current Player: {{ currentPlayerName }}</p>
    <p>Current Points: {{ currentPlayerScore }}</p>
    <p>Current Word: {{ currentWord }}</p>
    <button @click="incrementScore()">
      <img src="/icons/plus-1.svg" alt="Increment points" />
    </button>
    <button @click="getNewWord">
      <img src="/icons/refresh.svg" alt="Get new word" />
    </button>
  </div>
</template>