<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/activity/gameStore';
import { useI18n } from 'vue-i18n';
import { getWordListCategories } from '@/helpers/Activity/wordListHelper';
import { useWordListStore } from '@/stores/activity/wordListStore';

const { t } = useI18n();
const pushRouter = usePushRouter();
const gameStore = useGameStore();
const wordListStore = useWordListStore();

// Form data - exactly 2 groups, no more, no less
const groups = ref([
  { id: 0, name: t('activity.config.groups.default', { num: 1 }), players: [{ id: 0, name: '' }, { id: 1, name: '' }] },
  { id: 1, name: t('activity.config.groups.default', { num: 2 }), players: [{ id: 0, name: '' }, { id: 1, name: '' }] }
]);
const rounds = ref(3);
const timePerRound = ref(60);
const selectedGameModes = ref(['pantomime', 'draw', 'describe']);
const gameModes = ['pantomime', 'draw', 'describe'];
const allowedWordLists = ref<string[]>([]);
const defaultWordLists = ref<string[]>([]);  // Exclude 'spicy' category by default
const selectedWordLists = ref<string[]>([]);

onMounted(async () => {
  if (!wordListStore.isInitialized) {
    await wordListStore.init();
  }

  const wordLists = getWordListCategories();

  allowedWordLists.value = wordLists;
  defaultWordLists.value = wordLists.filter(list => list !== 'spicy');
  selectedWordLists.value = defaultWordLists.value;
});

// Add a player to a group
const addPlayer = (groupId: number) => {
  const group = groups.value.find(g => g.id === groupId);
  if (group) {
    const newId = group.players.length;
    group.players.push({ id: newId, name: '' });
  }
};

// Remove a player from a group (minimum 2 players required)
const removePlayer = (groupId: number, playerId: number) => {
  const group = groups.value.find(g => g.id === groupId);
  if (group && group.players.length > 2) {
    group.players = group.players.filter(player => player.id !== playerId);
    // Reassign IDs to ensure sequential ordering
    group.players.forEach((player, index) => {
      player.id = index;
    });
  }
};

// Submit the form and start the game
const startGame = () => {
  // Validate that each group has at least two players
  if (groups.value.some(group => group.players.length < 2)) {
    alert(t('activity.config.error.min-players-per-group-two'));
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

  // Validate that at least one word list is selected
  if (selectedWordLists.value.length === 0) {
    alert(t('activity.config.error.wordlist-required'));
    return;
  }

  // Validate that at least one round is set
  if (rounds.value < 1) {
    alert(t('activity.config.error.rounds-range'));
    return;
  }

  // Save settings to the store - match the structure used in tests
  gameStore.setGameStore({
    groups: groups.value.map(group => ({
      ...group,
      score: 0,
      currentPlayerIndex: 0
    })),
    rounds: rounds.value,
    timePerRound: timePerRound.value,
    gameModes: selectedGameModes.value,
    allowedWordLists: selectedWordLists.value,
    currentRound: 0,
    currentGroupIndex: 0
  });

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

    <div class="form-section groups-section">
      <h2>{{ t('activity.config.groups.setup') }}</h2>

      <div v-for="group in groups" :key="group.id" class="group-container">
        <p>{{ t('activity.config.groups.name') }}</p>
        <div class="group-header">
          <input v-model="group.name" type="text" :placeholder="t('activity.config.groups.name-placeholder')"
            class="group-name-input" required />
        </div>
        <p>{{ t('activity.config.player.name') }}</p>
        <div class="group-players">
          <div v-for="(player, idx) in group.players" :key="player.id" class="player-input">
            <input v-model="player.name" type="text" :placeholder="getPlayerPlaceholder(idx)" required />
            <button v-if="group.players.length > 2" @click="() => removePlayer(group.id, player.id)"
              class="remove-button">×</button>
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
      <h2>{{ t('activity.config.gameMode.title') }}</h2>
      <div class="game-modes">
        <label v-for="mode in gameModes" :key="mode" class="game-mode-option">
          <input type="checkbox" :value="mode" v-model="selectedGameModes" />
          {{ t(`activity.config.gameMode.${mode}`) }}
        </label>
      </div>
    </div>

    <div class="form-section">
      <h2>{{ t('activity.config.wordlist.title') }}</h2>
      <div class="game-modes">
        <label v-for="wordList in allowedWordLists" :key="wordList" class="game-mode-option">
          <input type="checkbox" :value="wordList" v-model="selectedWordLists" />
          {{ t(`activity.config.wordlist.${wordList}`, wordList) }}
        </label>
      </div>
    </div>

    <button @click="startGame" class="start-button">
      {{ t('activity.config.start-game') }}
    </button>
  </div>
</template>