<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/activity/settingsStore';

const pushRouter = usePushRouter();

// Initialize the store
const gameStore = useGameStore();
const currentPlayerName = ref('');

onMounted(() => {
    currentPlayerName.value = gameStore.getCurrentPlayer?.name || 'Unknown Player';
});
</script>
<template>
    <h1>Time is Up!</h1>
    <p>⌛</p>
    <p>Next up is: {{ currentPlayerName }}</p>
    <button @click="pushRouter('/activity/break')">Continue</button>
</template>