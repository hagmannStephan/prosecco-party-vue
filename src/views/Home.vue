<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper'
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';

const { t } = useI18n();

const pushRouter = usePushRouter();
</script>

<template>
  <button @click="pushRouter('/schnapsidee/game-config')">
    {{  t('home.schnapsidee-redirect') }}
  </button>
  <LanguageSwitcher />
</template>
