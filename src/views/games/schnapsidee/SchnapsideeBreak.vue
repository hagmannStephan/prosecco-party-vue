<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/schnapsidee/gameStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const pushRouter = usePushRouter();
const gS = useGameStore();

const currentPlayer = ref<{ id?: number, name: string } | null>(null);
const currentPlayerName = ref('');
const currentGroupName = ref('');

// Redirect to the game configuration page if the game settings are not complete
onMounted(() => {
    // Initialize player and group data
    currentPlayer.value = gS.getCurrentPlayer;
    if (currentPlayer.value) {
        currentPlayerName.value = currentPlayer.value.name;
        
        // Get the current group name
        const group = gS.getCurrentGroup;
        currentGroupName.value = group ? group.name : 'Unknown Team';
    } else {
        currentPlayerName.value = 'Unknown Player';
        currentGroupName.value = 'Unknown Team';
    }
});
</script>

<template>
    <h1>{{ currentPlayerName + t('schnapsidee.break.title') }}</h1>
    <h2>{{ t('schnapsidee.break.team') + ': ' + currentGroupName }}</h2>
    <h2>{{ t('schnapsidee.break.mode.title') }}</h2>
    <p>{{ t(`schnapsidee.break.mode.${gS.getCurrentGameMode || 'pantomime'}`) }}</p>
    <button @click="pushRouter('/schnapsidee')">{{ t('schnapsidee.break.button.start') }}</button>
</template>