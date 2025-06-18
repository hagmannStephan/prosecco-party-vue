<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper'
import { onMounted, ref } from 'vue';
import { useGameStore } from '@/stores/schnapsidee/gameStore';
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
    <h1>{{ t('schnapsidee.ranked.title') }}</h1>

    <ul>
        <li v-for="(player, index) in leaderboard" :key="index">
            {{ player.name }} - {{ player.score }}
        </li>
    </ul>

    <button @click="pushRouter('/')">{{ t('schnapsidee.ranked.button.home') }}</button>
    <button @click="pushRouter('/schnapsidee/game-config')">{{ t('schnapsidee.ranked.button.playAgain') }}</button>
</template>