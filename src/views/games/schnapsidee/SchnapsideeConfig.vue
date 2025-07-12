<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { useI18n } from 'vue-i18n';
import { getWordListCategories } from '@/helpers/schnapsidee/wordListHelper';
import { useWordListStore } from '@/stores/schnapsidee/wordListStore';
import GroupsConfig from '@/components/games/schnapsidee/config/GroupsConfig.vue';
import { validateGameConfig } from '@/helpers/schnapsidee/config/validateGameConfigHelper';
import { useRouter } from 'vue-router'

const { t } = useI18n();
const gameStore = useGameStore();
const wordListStore = useWordListStore();
const router = useRouter()

const rounds = ref(3);
const timePerRound = ref(60);
const selectedGameModes = ref(['pantomime', 'draw', 'describe']);
const gameModes = ['pantomime', 'draw', 'describe'];
const allowedWordLists = ref<string[]>([]);
const defaultWordLists = ref<string[]>([]);
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
  // Exclude 'spicy' category by default
  defaultWordLists.value = wordLists.filter(list => list !== 'spicy');
  selectedWordLists.value = defaultWordLists.value;
});

const startGame = () => {
  const passed = validateGameConfig(
    groups.value,
    selectedGameModes.value,
    selectedWordLists.value,
    rounds.value,
    t
  );
  if (!passed) {
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

  // Navigate to the game view
  router.push({ path: '/schnapsidee/break'});
}
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
          <br>
        </label>
      </div>
    </div>

    <div class="form-section">
      <h2>{{ t('schnapsidee.config.wordlist.title') }}</h2>
      <div class="game-modes">
        <label v-for="wordList in allowedWordLists" :key="wordList" class="game-mode-option">
          <input type="checkbox" :value="wordList" v-model="selectedWordLists" />
          {{ t(`schnapsidee.config.wordlist.${wordList}`, wordList) }}
        <br>
        </label>
      </div>
    </div>

    <button @click="startGame" class="start-button">
      {{ t('schnapsidee.config.start-game') }}
    </button>
  </div>
</template>