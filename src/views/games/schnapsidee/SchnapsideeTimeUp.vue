<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/schnapsidee/gameStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

// Initialize the store
const gameStore = useGameStore();
const currentPlayer = ref<{ id?: number, name: string } | null>(null);
const currentPlayerName = ref('');
const currentGroupName = ref('');

onMounted(() => {
    // Initialize player and group data
    currentPlayer.value = gameStore.getCurrentPlayer;
    if (currentPlayer.value) {
        currentPlayerName.value = currentPlayer.value.name;
        
        // Get the current group name
        const group = gameStore.getCurrentGroup;
        currentGroupName.value = group ? group.name : 'Unknown Team';
    } else {
        currentPlayerName.value = 'Unknown Player';
        currentGroupName.value = 'Unknown Team';
    }
});
</script>

<template>
    <h1>{{ t('schnapsidee.timeUp.title') }}</h1>
    <p>⌛</p>
    <p>{{ t('schnapsidee.timeUp.message') }} <b>{{ currentPlayerName }}</b></p>
    <p>{{ t('schnapsidee.timeUp.team') }}: <b>{{ currentGroupName }}</b></p>
    <button @click="router.push({ path: '/schnapsidee/break'})">{{ t('schnapsidee.timeUp.button') }}</button>
</template>