<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router'

const { t } = useI18n();
const router = useRouter();

</script>
<template>
    <h1>{{ t('schnapsidee.done.title') }}</h1>
    <p>🏁</p>
    <p>{{ t('schnapsidee.done.message') }}</p>
    <button @click="router.push({ path: '/schnapsidee/ranked'})">{{ t('schnapsidee.done.button') }}</button>
</template>