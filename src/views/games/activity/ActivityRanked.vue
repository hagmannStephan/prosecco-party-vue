<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper'
import { onMounted, ref } from 'vue';
import { useGameStore } from '@/stores/activity/settingsStore';

const pushRouter = usePushRouter();

const gameStore = useGameStore();
const leaderboard = ref<{ name: string; score: number }[]>([]);

onMounted(() => {
    leaderboard.value = gameStore.getLeaderboard();
});
</script>
<template>
    <h1>Activity Ranked</h1>

    <ul>
        <li v-for="(player, index) in leaderboard" :key="index">
            {{ player.name }} - {{ player.score }}
        </li>
    </ul>

    <button @click="pushRouter('/')">Go Home!</button>
</template>