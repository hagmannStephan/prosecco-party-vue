<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const pushRouter = usePushRouter();
</script>
<template>
    <h1>{{ t('schnapsidee.done.title') }}</h1>
    <p>🏁</p>
    <p>{{ t('schnapsidee.done.message') }}</p>
    <button @click="pushRouter('/schnapsidee/ranked')">{{ t('schnapsidee.done.button') }}</button>
</template>