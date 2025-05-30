<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper'
import { useGameStore } from '@/stores/activity/gameStore';
import { getRandomWord } from '@/helpers/Activity/wordListHelper';
import { useWordListStore } from '@/stores/activity/wordListStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const pushRouter = usePushRouter();

// Initialize the stores
const gameStore = useGameStore();
const wordListStore = useWordListStore();

// Reactive data
const currentPlayer = ref<{ id?: number, name: string } | null>(null);
const currentPlayerName = ref('');
const currentGroupName = ref('');
const currentGroupScore = ref(0);
const currentWord = ref('Loading...');
const timeRemaining = ref(0);
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null);
const forbiddenWords = ref<string[]>([]);
const gameMode = ref('');
const isLoading = ref(true);

// Initialize current player and group data
function updatePlayerData() {
  currentPlayer.value = gameStore.getCurrentPlayer;
  let group = gameStore.getCurrentGroup;
  
  if (currentPlayer.value) {
    currentPlayerName.value = currentPlayer.value.name;
    currentGroupScore.value = group?.score || 0;
    
    // Get the current group name
    currentGroupName.value = group ? group.name : 'Unknown Team';
  } else {
    currentPlayerName.value = 'Unknown Player';
    currentGroupName.value = 'Unknown Team';
    currentGroupScore.value = 0;
  }
}

// Initialize player data
updatePlayerData();

// Watch for changes in the store's current player and update the score reactively
watch(
  () => {
    // Return a computed value that will trigger the watcher when either the current player or score changes
    const group = gameStore.getCurrentGroup;
    const player = gameStore.getCurrentPlayer;
    const score = group ? group.score : 0;
    return { player, score };
  },
  () => {
    updatePlayerData();
  },
  { deep: true }
);

function getNewWord() {
  // Check if wordListStore is initialized
  if (!wordListStore.isInitialized) {
    console.warn('Word list store not yet initialized');
    currentWord.value = 'Loading word list...';
    forbiddenWords.value = [];
    return;
  }

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
  const state = gameStore.continueToNextPlayer();
  if (state.gameOver) {
    pushRouter('/activity/done')
  } else {
    pushRouter('/activity/time-up')
  }
}

function incrementScore() {
  if (currentPlayer.value) {
    gameStore.changeScore(1);
    getNewWord();
  }
}

function decrementScore() {
  if (currentPlayer.value) {
    gameStore.changeScore(-1);
    getNewWord();
  }
}

function skipWord() {
  if (currentPlayer.value) {
    gameStore.skipWord();
    getNewWord();
  }
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

async function initGame() {
  isLoading.value = true;
  
  try {
    // Make sure the word list is initialized first
    await wordListStore.init();
    
    gameMode.value = gameStore.getCurrentGameMode || 'Something went wrong 😐';
    
    getNewWord();
    startTimer();
  } catch (error) {
    console.error('Error initializing game:', error);
    currentWord.value = 'Error loading game data';
  } finally {
    isLoading.value = false;
  }
}

// Track the available skips
const skipsUsedUp = computed(() => (gameStore.getCurrentSkipsLeft ?? 0) <= 0)

onMounted(() => {
  initGame();
});

onUnmounted(() => {
  if (timerInterval.value !== null) {
    clearInterval(timerInterval.value);
  }
});
</script>

<template>
  <div v-if="isLoading" class="loading">
    <p>Loading game data...</p>
  </div>
  <div v-else>
    <div>
      <h1>{{ currentPlayerName + t('activity.game.title') }}</h1>
      <h2>{{ t('activity.game.team') + ': ' + currentGroupName }}</h2>
      <p>{{ t(`activity.game.mode.${gameMode}`) || 'Unknown Mode' }}</p>
      <p>⌛ {{ timeRemaining + t('activity.game.seconds') }}</p>
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
      <p>+ {{ currentGroupScore + t('activity.game.points') }}</p>
        <!-- Our Team guessed it (+1 point) -->
        <button @click="incrementScore">{{ gameStore.getCurrentGroup.name }} (+1)</button>
        <!-- Opposing Team guessed it (-1 point)-->
        <button @click="decrementScore">{{ gameStore.getOpposingGroup.name }} (-1)</button>

        <br>
        <!-- Skip Word (For the first three times free, afterwards -1 point) -->
        <button @click="skipWord">
          {{ skipsUsedUp ? t('activity.game.skip.usedUp') : t('activity.game.skip.normal') }}
        </button>
    </div>
  </div>
</template>