<script setup lang="ts">
import { ref } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/activity/settingsStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const pushRouter = usePushRouter();
const gameStore = useGameStore();

// Form data
const groups = ref([
  { id: 1, name: t('activity.config.groups.default', { num: 1 }), players: [{ id: 1, name: '' }], score: 0 },
  { id: 2, name: t('activity.config.groups.default', { num: 2 }), players: [{ id: 2, name: '' }], score: 0 }
]);
const rounds = ref(3);
const timePerRound = ref(60);
const selectedGameModes = ref(['easy', 'normal', 'hard']);
const gameModes = ['easy', 'normal', 'hard'];

// Add a new group
const addGroup = () => {
  const newId = groups.value.length > 0 ? Math.max(...groups.value.map(g => g.id)) + 1 : 1;
  groups.value.push({ 
    id: newId, 
    name: t('activity.config.groups.default', { num: newId }), 
    players: [], 
    score: 0 
  });
};

// Remove a group
const removeGroup = (id: number) => {
  if (groups.value.length > 2) {
    groups.value = groups.value.filter(group => group.id !== id);
  }
};

// Add a player to a group
const addPlayer = (groupId: number) => {
  const group = groups.value.find(g => g.id === groupId);
  if (group) {
    const playersInGroup = group.players;
    const newId = playersInGroup.length > 0 ? Math.max(...playersInGroup.map(p => p.id)) + 1 : 1;
    group.players.push({ id: newId, name: '' });
  }
};

// Remove a player from a group
const removePlayer = (groupId: number, playerId: number) => {
  const group = groups.value.find(g => g.id === groupId);
  if (group && group.players.length > 1) {
    group.players = group.players.filter(player => player.id !== playerId);
  }
};

// Submit the form and start the game
const startGame = () => {
  // Validate that we have at least 2 groups
  if (groups.value.length < 2) {
    alert(t('activity.config.error.min-groups'));
    return;
  }

  // Validate that each group has at least one player
  if (groups.value.some(group => group.players.length === 0)) {
    alert(t('activity.config.error.min-players-per-group'));
    return;
  }

  // Validate that all players have names
  for (const group of groups.value) {
    if (group.players.some(player => !player.name.trim())) {
      alert(t('activity.config.error.name-required'));
      return;
    }
  }

  // Validate that all groups have names
  if (groups.value.some(group => !group.name.trim())) {
    alert(t('activity.config.error.group-name-required'));
    return;
  }

  // Validate that at least one game mode is selected
  if (selectedGameModes.value.length === 0) {
    alert(t('activity.config.error.mode-required'));
    return;
  }

  // Save settings to the store
  gameStore.setGameSettings({
    groups: groups.value,
    rounds: rounds.value,
    timePerRound: timePerRound.value,
    gameModes: selectedGameModes.value,
    currentRound: 0,
    currentPlayerIndex: 0,
    currentGroupIndex: 0
  });

  gameStore.init();

  // Navigate to the game
  pushRouter('/activity/break');
};

function getPlayerPlaceholder(index: number) {
  if (index === 0) return t('activity.config.player.placeholder.1');
  if (index === 1) return t('activity.config.player.placeholder.2');
  return t('activity.config.player.placeholder.3+');
}
</script>

<template>
  <div class="config-container">
    <h1>{{ t('activity.config.title') }}</h1>
    
    <div class="form-section">
      <h2>{{ t('activity.config.groups.num') }}</h2>
      <div class="group-controls">
        <button @click="addGroup" class="control-button">+</button>
        <span>{{ groups.length }}</span>
        <button 
          @click="() => groups.length > 2 && removeGroup(groups[groups.length - 1].id)" 
          class="control-button" 
          :disabled="groups.length <= 2"
        >-</button>
      </div>
    </div>

    <div class="form-section groups-section">
      <h2>{{ t('activity.config.groups.setup') }}</h2>
      
      <div v-for="group in groups" :key="group.id" class="group-container">
        <p>{{ t('activity.config.groups.name') }}</p>
        <div class="group-header">
          <input 
            v-model="group.name" 
            type="text" 
            :placeholder="t('activity.config.groups.name-placeholder')"
            class="group-name-input"
            required
          />
          <button 
            v-if="groups.length > 2" 
            @click="() => removeGroup(group.id)" 
            class="remove-button"
          >×</button>
        </div>
        <p>{{ t('activity.config.player.name') }}</p>
        <div class="group-players">
          <div v-for="(player, idx) in group.players" :key="player.id" class="player-input">
            <input 
              v-model="player.name" 
              type="text" 
              :placeholder="getPlayerPlaceholder(idx)"
              required
            />
            <button 
              v-if="group.players.length > 1" 
              @click="() => removePlayer(group.id, player.id)" 
              class="remove-button"
            >×</button>
          </div>
          
          <button @click="() => addPlayer(group.id)" class="add-player-button">
            + {{ t('activity.config.player.add') }}
          </button>
        </div>
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
      <h2>{{ t('activity.config.difficulty.title') }}</h2>
      <div class="game-modes">
        <label v-for="mode in gameModes" :key="mode" class="game-mode-option">
          <input 
            type="checkbox"
            :value="mode" 
            v-model="selectedGameModes"
          />
          {{ t(`activity.config.difficulty.${mode}`) }}
        </label>
      </div>
    </div>

    <button @click="startGame" class="start-button">
      {{ t('activity.config.start-game') }}
    </button>
  </div>
  <!-- TODO: Add option to modify word list if PWA -->
  <!-- TODO: Add option to add own game modes -->
</template>