<script setup lang="ts">
import { useGameStore } from '@/stores/schnapsidee/gameStore';
import { computed, onMounted, ref } from 'vue';
import { getRandomWord } from '@/helpers/schnapsidee/wordListHelper';
import { useWordListStore } from '@/stores/schnapsidee/wordListStore';
import { useI18n } from 'vue-i18n';

interface Player {
    id?: number;
    name: string;
}

const props = defineProps<{
    gameStore: ReturnType<typeof useGameStore>;
    currentPlayer: Player | null;
    currentGroupScore: number;
}>();
const emit = defineEmits<{
  (e: 'update:gameMode', value: string): void;
}>();
const wordListStore = useWordListStore();
const { t } = useI18n();

const forbiddenWords = ref<string[]>([]);
const currentWord = ref('Loading...');
const isLoading = ref(true);

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
    if (props.gameStore.getCurrentGameMode === 'describe' && wordEntry.forbidden) {
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
  if (props.currentPlayer) {
    props.gameStore.changeScore(1);
    getNewWord();
  }
}

function decrementScore() {
  if (props.currentPlayer) {
    props.gameStore.changeScore(-1);
    getNewWord();
  }
}

function skipWord() {
  if (props.currentPlayer) {
    props.gameStore.skipWord();
    getNewWord();
  }
}

// Track the available skips
const skipsUsedUp = computed(() => (props.gameStore.getCurrentSkipsLeft ?? 0) <= 0)

onMounted(async () => {
    isLoading.value = true;
  
    try {
        await wordListStore.init();
        emit('update:gameMode', props.gameStore.getCurrentGameMode || 'fallback');
        
        getNewWord();
    } catch (error) {
        console.error('Error initializing game:', error);
    } finally {
        isLoading.value = false;
    }
})
</script>
<template>
    <div v-if="isLoading" class="loading">
        <p>Loading game data...</p>
    </div>
    <div v-else>
        <div>
            <h2>{{ currentWord }}</h2>
            <div v-if="props.gameStore.getCurrentGameMode === 'describe' && forbiddenWords.length > 0" class="forbidden-words">
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