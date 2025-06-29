<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/schnapsidee/gameStore';
import { useI18n } from 'vue-i18n';
import { getWordListCategories } from '@/helpers/schnapsidee/wordListHelper';
import { useWordListStore } from '@/stores/schnapsidee/wordListStore';
import GroupsConfig from '@/components/games/schnapsidee/config/GroupsConfig.vue';

const { t } = useI18n();
const pushRouter = usePushRouter();
const gameStore = useGameStore();
const wordListStore = useWordListStore();


const rounds = ref(3);
const timePerRound = ref(60);
const selectedGameModes = ref(['pantomime', 'draw', 'describe']);
const gameModes = ['pantomime', 'draw', 'describe'];
const allowedWordLists = ref<string[]>([]);
const defaultWordLists = ref<string[]>([]);  // Exclude 'spicy' category by default
const selectedWordLists = ref<string[]>([]);

// Declare default groups
const groups = ref([
  { id: 0, name: t('schnapsidee.config.groups.default', { num: 1 }), players: [{ id: 0, name: '' }, { id: 1, name: '' }] },
  { id: 1, name: t('schnapsidee.config.groups.default', { num: 2 }), players: [{ id: 0, name: '' }, { id: 1, name: '' }] }
]);

onMounted(async () => {
  if (!wordListStore.isInitialized) {
    await wordListStore.init();
  }

  const wordLists = getWordListCategories();

  allowedWordLists.value = wordLists;
  defaultWordLists.value = wordLists.filter(list => list !== 'spicy');
  selectedWordLists.value = defaultWordLists.value;
});


// Submit the form and start the game
const startGame = () => {
  // Validate that each group has at least two players
  if (groups.value.some(group => group.players.length < 2)) {
    alert(t('schnapsidee.config.error.min-players-per-group-two'));
    return;
  }

  // Validate that all players have names
  for (const group of groups.value) {
    if (group.players.some(player => !player.name.trim())) {
      alert(t('schnapsidee.config.error.name-required'));
      return;
    }
  }

  // Validate that all groups have names
  if (groups.value.some(group => !group.name.trim())) {
    alert(t('schnapsidee.config.error.group-name-required'));
    return;
  }

  // Validate that at least one game mode is selected
  if (selectedGameModes.value.length === 0) {
    alert(t('schnapsidee.config.error.mode-required'));
    return;
  }

  // Validate that at least one word list is selected
  if (selectedWordLists.value.length === 0) {
    alert(t('schnapsidee.config.error.wordlist-required'));
    return;
  }

  // Validate that at least one round is set
  if (rounds.value < 1) {
    alert(t('schnapsidee.config.error.rounds-range'));
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
  pushRouter('/schnapsidee/break');
};
</script>

<template>
  <div class="config-container">
    <h1>{{ t('schnapsidee.config.title') }}</h1>

    <GroupsConfig 
      :groups="groups"
    />

    <div class="form-section">
      <h2>{{ t('schnapsidee.config.round.num') }}</h2>
      <input v-model.number="rounds" type="number" min="1" max="10" />
    </div>

    <div class="form-section">
      <h2>{{ t('schnapsidee.config.round.time') }}</h2>
      <select v-model="timePerRound">
        <option value="30">30 {{ t('schnapsidee.config.round.sec') }}</option>
        <option value="60">60 {{ t('schnapsidee.config.round.sec') }}</option>
        <option value="90">90 {{ t('schnapsidee.config.round.sec') }}</option>
        <option value="120">120 {{ t('schnapsidee.config.round.sec') }}</option>
      </select>
    </div>

    <div class="form-section">
      <h2>{{ t('schnapsidee.config.gameMode.title') }}</h2>
      <div class="game-modes">
        <label v-for="mode in gameModes" :key="mode" class="game-mode-option">
          <input type="checkbox" :value="mode" v-model="selectedGameModes" />
          {{ t(`schnapsidee.config.gameMode.${mode}`) }}
        </label>
      </div>
    </div>

    <div class="form-section">
      <h2>{{ t('schnapsidee.config.wordlist.title') }}</h2>
      <div class="game-modes">
        <label v-for="wordList in allowedWordLists" :key="wordList" class="game-mode-option">
          <input type="checkbox" :value="wordList" v-model="selectedWordLists" />
          {{ t(`schnapsidee.config.wordlist.${wordList}`, wordList) }}
        </label>
      </div>
    </div>

    <button @click="startGame" class="start-button">
      {{ t('schnapsidee.config.start-game') }}
    </button>
  </div>
</template>