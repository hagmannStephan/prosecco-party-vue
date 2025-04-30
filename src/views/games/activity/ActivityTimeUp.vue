<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/activity/settingsStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const pushRouter = usePushRouter();

// Initialize the store
const gameStore = useGameStore();
const currentPlayerName = ref('');

onMounted(() => {
    currentPlayerName.value = gameStore.getCurrentPlayer?.name || 'Unknown Player';
});
</script>
<template>
    <h1>{{ t('activity.timeUp.title') }}</h1>
    <p>⌛</p>
    <p>{{ t('activity.timeUp.message.part1') }} <b>{{ currentPlayerName }}</b> {{ t('activity.timeUp.message.part2') }}</p>
    <button @click="pushRouter('/activity/break')">{{ t('activity.timeUp.button') }}</button>
</template>