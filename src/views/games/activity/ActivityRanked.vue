<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper'
import { onMounted, ref } from 'vue';
import { useGameStore } from '@/stores/activity/gameStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const pushRouter = usePushRouter();

const gameStore = useGameStore();
const leaderboard = ref<{ name: string; score: number }[]>([]);

onMounted(() => {
    leaderboard.value = gameStore.gameComplete();
});
</script>
<template>
    <h1>{{ t('activity.ranked.title') }}</h1>

    <ul>
        <li v-for="(player, index) in leaderboard" :key="index">
            {{ player.name }} - {{ player.score }}
        </li>
    </ul>

    <button @click="pushRouter('/')">{{ t('activity.ranked.button.home') }}</button>
    <button @click="pushRouter('/activity/game-config')">{{ t('activity.ranked.button.playAgain') }}</button>
</template>