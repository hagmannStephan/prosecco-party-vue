<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const pushRouter = usePushRouter();
</script>
<template>
    <h1>{{ t('activity.done.title') }}</h1>
    <p>🏁</p>
    <p>{{ t('activity.done.message') }}</p>
    <button @click="pushRouter('/activity/ranked')">{{ t('activity.done.button') }}</button>
</template>