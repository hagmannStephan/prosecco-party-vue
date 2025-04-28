<script setup lang="ts">
import { ref } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/activity/settingsStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const pushRouter = usePushRouter();
const gameStore = useGameStore();

// Form data
const players = ref([
  { id: 1, name: '', score: 0 },
  { id: 2, name: '', score: 0 }
]);
const rounds = ref(3);
const timePerRound = ref(60);
const selectedGameModes = ref(['easy', 'normal', 'hard']);
const gameModes = ['easy', 'normal', 'hard'];

// Add a new player
const addPlayer = () => {
  const newId = players.value.length > 0 ? Math.max(...players.value.map(p => p.id)) + 1 : 1;
  players.value.push({ id: newId, name: '', score: 0 });
};

// Remove a player
const removePlayer = (id: number) => {
  if (players.value.length > 2) {
    players.value = players.value.filter(player => player.id !== id);
  }
};

// Submit the form and start the game
const startGame = () => {
  // Validate that we have at least 2 players
  if (players.value.length < 2) {
    alert(t('activity.config.error.min-players'));
    return;
  }

  // Validate that all players have names
  if (players.value.some(player => !player.name.trim())) {
    alert(t('activity.config.error.name-required'));
    return;
  }

  // Validate that at least one game mode is selected
  if (selectedGameModes.value.length === 0) {
    alert(t('activity.config.error.mode-required'));
    return;
  }

  // Save settings to the store
  gameStore.setGameSettings({
    players: players.value,
    rounds: rounds.value,
    timePerRound: timePerRound.value,
    gameModes: selectedGameModes.value,
    currentRound: 0,
    currentPlayer: 0,
  });

  // Navigate to the game
  pushRouter('/activity/break');
};

function getPlaceholder(id: number) {
  if (id === 1) return t('activity.config.player.placeholder.1');
  if (id === 2) return t('activity.config.player.placeholder.2');
  return t('activity.config.player.placeholder.3+');}
</script>

<template>
  <div class="config-container">
    <h1>{{ t('activity.config.title') }}</h1>
    
    <div class="form-section">
      <h2>{{ t('activity.config.player.num') }}</h2>
      <div class="player-controls">
        <button @click="addPlayer" class="control-button">+</button>
        <span>{{ players.length }}</span>
        <button 
          @click="() => players.length > 2 && removePlayer(players[players.length - 1].id)" 
          class="control-button" 
          :disabled="players.length <= 2"
        >-</button>
      </div>
    </div>

    <div class="form-section">
      <h2>{{ t('activity.config.player.name') }}</h2>
      <div v-for="player in players" :key="player.id" class="player-input">
        <input 
          v-model="player.name" 
          type="text" 
          :placeholder="getPlaceholder(player.id)"
          required
        />
        <button 
          v-if="players.length > 2" 
          @click="() => removePlayer(player.id)" 
          class="remove-button"
        >×</button>
      </div>
    </div>

    <div class="form-section">
      <h2>{{ t('activity.config.round.num') }}</h2>
      <input v-model.number="rounds" type="number" min="1" max="10" />
    </div>

    <div class="form-section">
      <h2>{{ t('activity.config.round.time') }}</h2>
      <select v-model="timePerRound">
        <option value="30">30 {{ t('activity.config.round.sec') }}</option>
        <option value="60">60 {{ t('activity.config.round.sec') }}</option>
        <option value="90">90 {{ t('activity.config.round.sec') }}</option>
        <option value="120">120 {{ t('activity.config.round.sec') }}</option>
      </select>
    </div>

    <div class="form-section">
      <h2>{{ t('activity.config.mode.title') }}</h2>
      <div class="game-modes">
        <label v-for="mode in gameModes" :key="mode" class="game-mode-option">
          <input 
            type="checkbox"
            :value="mode" 
            v-model="selectedGameModes"
          />
          {{ t(`activity.config.mode.${mode}`) }}
        </label>
      </div>
    </div>

    <button @click="startGame" class="start-button">
      {{ t('activity.config.start-game') }}
    </button>
  </div>
  <!-- TODO: Add option to modify word list if PWA -->
</template>
