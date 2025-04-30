<script setup lang="ts">
import { onMounted } from 'vue';
import { usePushRouter } from '@/helpers/routerHelper';
import { useGameStore } from '@/stores/activity/settingsStore';
import { useI18n } from 'vue-i18n';
import { isPiniaComplete } from '@/helpers/Activity/configHelper';

const { t } = useI18n();
const pushRouter = usePushRouter();
const gS = useGameStore();

// Redirect to the game configuration page if the game settings are not complete
onMounted(() => {
    if (!isPiniaComplete(gS)) {
        pushRouter('/activity/config');
    }
});
</script>
<template>
    <h1>{{ gS.getCurrentPlayer.name + t('activity.break.title') }}</h1>
    <h2>{{ t('activity.break.mode.title') }}</h2>
    <p>{{ t(`activity.break.mode.${gS.getCurrentGameMode?.name || 'pantomime'}`) }}</p>
    <button @click="pushRouter('/activity')">{{ t('activity.break.button.start') }}</button>
</template>