<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useGameStore } from '@/stores/schnapsidee/gameStore';
import { getRandomWord } from '@/helpers/schnapsidee/wordListHelper';
import { useWordListStore } from '@/stores/schnapsidee/wordListStore';
import { useI18n } from 'vue-i18n';
import RoundTimer from '@/components/games/schnapsidee/game/RoundTimer.vue';

const { t } = useI18n();

// Initialize the stores
const gameStore = useGameStore();
const wordListStore = useWordListStore();

// Reactive data
const currentPlayer = ref<{ id?: number, name: string } | null>(null);
const currentPlayerName = ref('');
const currentGroupName = ref('');
const currentGroupScore = ref(0);
const currentWord = ref('Loading...');
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

async function initGame() {
  isLoading.value = true;
  
  try {
    // Make sure the word list is initialized first
    await wordListStore.init();
    
    gameMode.value = gameStore.getCurrentGameMode || 'Something went wrong 😐';
    
    getNewWord();
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
</script>

<template>
  <div v-if="isLoading" class="loading">
    <p>Loading game data...</p>
  </div>
  <div v-else>
    <div>
      <h1>{{ currentPlayerName + t('schnapsidee.game.title') }}</h1>
      <h2>{{ t('schnapsidee.game.team') + ': ' + currentGroupName }}</h2>
      <p>{{ t(`schnapsidee.game.mode.${gameMode}`) || 'Unknown Mode' }}</p>
      <RoundTimer :gameStore="gameStore"/>
    </div>
    <div>
      <h2>{{ currentWord }}</h2>
      <div v-if="gameMode === 'describe' && forbiddenWords.length > 0" class="forbidden-words">
        <h3>{{ t('schnapsidee.game.forbidden') }}</h3>
        <ul>
          <li v-for="(word, index) in forbiddenWords" :key="index">{{ word }}</li>
        </ul>
      </div>
    </div>
    <div>
      <p>+ {{ currentGroupScore + t('schnapsidee.game.points') }}</p>
        <!-- Our Team guessed it (+1 point) -->
        <button @click="incrementScore">{{ gameStore.getCurrentGroup.name }} (+1)</button>
        <!-- Opposing Team guessed it (-1 point)-->
        <button @click="decrementScore">{{ gameStore.getOpposingGroup.name }} (-1)</button>

        <br>
        <!-- Skip Word (For the first three times free, afterwards -1 point) -->
        <button @click="skipWord">
          {{ skipsUsedUp ? t('schnapsidee.game.skip.usedUp') : t('schnapsidee.game.skip.normal') }}
        </button>
    </div>
  </div>
</template>