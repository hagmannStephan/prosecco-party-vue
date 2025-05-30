<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/activity/gameStore';
import { useI18n } from 'vue-i18n';
import { isPiniaComplete } from '@/helpers/Activity/configHelper';

const { t } = useI18n();
const pushRouter = usePushRouter();
const gS = useGameStore();

const currentPlayer = ref<{ id?: number, name: string } | null>(null);
const currentPlayerName = ref('');
const currentGroupName = ref('');

// Redirect to the game configuration page if the game settings are not complete
onMounted(() => {
    if (!isPiniaComplete(gS)) {
        pushRouter('/activity/config');
        return;
    }
    
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
    <h1>{{ currentPlayerName + t('activity.break.title') }}</h1>
    <h2>{{ t('activity.break.team') + ': ' + currentGroupName }}</h2>
    <h2>{{ t('activity.break.mode.title') }}</h2>
    <p>{{ t(`activity.break.mode.${gS.getCurrentGameMode || 'pantomime'}`) }}</p>
    <button @click="pushRouter('/activity')">{{ t('activity.break.button.start') }}</button>
</template>