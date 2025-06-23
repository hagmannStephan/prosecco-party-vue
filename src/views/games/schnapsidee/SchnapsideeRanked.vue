<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper'
import { onMounted, ref } from 'vue';
import { useGameStore } from '@/stores/schnapsidee/gameStore';
import { useI18n } from 'vue-i18n';
import { usePenaltiesStore } from '@/stores/penaltiesStore';
import { useLanguageSettingsStore } from '@/stores/languageSettingsStore'

const { t } = useI18n();
const pushRouter = usePushRouter();

const gameStore = useGameStore();
const penaltiesStore = usePenaltiesStore();
const leaderboard = ref<{ name: string; score: number }[]>([]);
const penalties = ref<string[]>([]);
const languageSettingsStore = useLanguageSettingsStore()
const language = languageSettingsStore.getLanguage()

onMounted(() => {
    leaderboard.value = gameStore.gameComplete();
    penalties.value = penaltiesStore.getRandomPenaltySelection(language);
});
</script>
<template>
    <h1>{{ t('schnapsidee.ranked.title') }}</h1>

    <ul>
        <li v-for="(player, index) in leaderboard" :key="index">
            {{ player.name }} - {{ player.score }}
        </li>
    </ul>

    <button @click="pushRouter('/')">{{ t('schnapsidee.ranked.button.home') }}</button>
    <button @click="pushRouter('/schnapsidee/game-config')">{{ t('schnapsidee.ranked.button.playAgain') }}</button>

    <h2>{{ t('schnapsidee.ranked.penalty.title') }}</h2>
    <p>{{ t('schnapsidee.ranked.penalty.description') }}</p>
    <ul>
        <li v-for="(penalty, index) in penalties" :key="index">
            {{ penalty }}
        </li>
    </ul>
</template>