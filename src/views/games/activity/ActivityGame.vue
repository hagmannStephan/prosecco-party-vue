<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper'
import { useGameStore } from '@/stores/activity/settingsStore';
import { getRandomWord } from '@/helpers/Activity/wordListHelper';
import { useWordListStore } from '@/stores/activity/wordListStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const pushRouter = usePushRouter();

// Initialize the store
const gameStore = useGameStore();
const currentPlayerName = ref('');
const currentPlayerScore = ref(0);
const currentWord = ref('');
const timeRemaining = ref(0);
const timerInterval = ref<number | null>(null);
const forbiddenWords = ref<string[]>([]);
const gameMode = ref('');

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
   
    // Handle forbidden words for describe mode
    if (gameMode.value === 'describe' && wordEntry.forbidden) {
      forbiddenWords.value = wordEntry.forbidden;
    } else {
      forbiddenWords.value = [];
    }
  } else {
    currentWord.value = wordEntry;
    forbiddenWords.value = [];
  }
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

  gameMode.value = gameStore.getCurrentGameMode?.name || 'Something went wrong 😐';
  
  getNewWord();
  startTimer();
});
onUnmounted(() => {
  if (timerInterval.value !== null) {
    clearInterval(timerInterval.value);
  }
});
</script>
<template>
  <div>
    <h1>{{ currentPlayerName + t('activity.game.title') }}</h1>
    <p>{{ t(`activity.game.mode.${gameMode}`) }}</p>
    <p>⌛ {{ timeRemaining  + t('activity.game.seconds')}}</p>
  </div>
  <div>
    <h2>{{ currentWord }}</h2>
    <div v-if="gameMode === 'describe' && forbiddenWords.length > 0" class="forbidden-words">
      <h3>{{ t('activity.game.forbidden') }}</h3>
      <ul>
        <li v-for="(word, index) in forbiddenWords" :key="index">{{ word }}</li>
      </ul>
    </div>
  </div>
  <div>
    <p>+ {{ currentPlayerScore + t('activity.game.points')}}</p>
    <button @click="incrementScore()">
      <img src="/icons/plus-1.svg" :alt="t('activity.game.image-alt.plus-one')" />
    </button>
    <button @click="getNewWord">
      <img src="/icons/refresh.svg" :alt="t('activity.game.image-alt.reload')" />
    </button>
  </div>
</template>