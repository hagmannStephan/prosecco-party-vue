<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGameStore } from '@/stores/schnapsidee/gameStore';
import { useI18n } from 'vue-i18n';
import RoundTimer from '@/components/games/schnapsidee/game/RoundTimer.vue';
import WordPanel from '@/components/games/schnapsidee/game/WordPanel.vue';

const { t } = useI18n();

// Initialize the stores
const gameStore = useGameStore();

// Reactive data
const currentPlayerName = ref('');
const currentGroupName = ref('');
const currentPlayer = ref<{ id?: number, name: string } | null>(null);
const currentGroupScore = ref(0);
const gameMode = ref('pantomime');

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
</script>

<template>
    <div>
      <h1>{{ currentPlayerName + t('schnapsidee.game.title') }}</h1>
      <h2>{{ t('schnapsidee.game.team') + ': ' + currentGroupName }}</h2>
      <p>{{ t(`schnapsidee.game.mode.${gameMode}`) || 'Unknown Mode' }}</p>
      <RoundTimer :gameStore="gameStore"/>
    </div>
    <WordPanel :gameStore="gameStore" :currentPlayer="currentPlayer" :currentGroupScore="currentGroupScore" v-model:gameMode="gameMode"/>
</template>