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
const currentPlayer = ref<{ player: { id: number, name: string }, groupId: number } | null>(null);
const currentPlayerName = ref('');
const currentGroupName = ref('');
const currentGroupScore = ref(0);
const currentWord = ref('');
const timeRemaining = ref(0);
const timerInterval = ref<number | null>(null);
const forbiddenWords = ref<string[]>([]);
const gameMode = ref('');

// Initialize current player and group data
function updatePlayerData() {
  currentPlayer.value = gameStore.getCurrentPlayer;
  
  if (currentPlayer.value) {
    currentPlayerName.value = currentPlayer.value.player.name;
    currentGroupScore.value = gameStore.getScore(currentPlayer.value.groupId);
    
    // Get the current group name
    const group = gameStore.getGroups.find(g => g.id === currentPlayer.value?.groupId);
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
    const player = gameStore.getCurrentPlayer;
    const score = player ? gameStore.getScore(player.groupId) : 0;
    return { player, score };
  },
  () => {
    updatePlayerData();
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
  const gameOver = gameStore.nextPlayer();
  if (gameOver) {
    pushRouter('/activity/done')
  } else {
    pushRouter('/activity/time-up')
  }
}

function incrementScore() {
  if (currentPlayer.value) {
    gameStore.incrementScore(currentPlayer.value.groupId);
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
    <h2>{{ t('activity.game.team') + ': ' + currentGroupName }}</h2>
    <p>{{ t(`activity.game.mode.${gameMode}`), 'Unknown Mode' }}</p>
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
    <p>+ {{ currentGroupScore + t('activity.game.points')}}</p>
    <button @click="incrementScore()">
      <img src="/icons/plus-1.svg" :alt="t('activity.game.image-alt.plus-one')" />
    </button>
    <button @click="getNewWord">
      <img src="/icons/refresh.svg" :alt="t('activity.game.image-alt.reload')" />
    </button>
  </div>
</template>