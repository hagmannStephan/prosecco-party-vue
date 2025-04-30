<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper'
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';

const { t } = useI18n();

const pushRouter = usePushRouter();
</script>

<template>
  <!-- TODO: Add option to switch between English and German -->
  <button @click="pushRouter('/activity/game-config')">
    {{  t('home.activities-redirect') }}
  </button>
  <LanguageSwitcher />
</template>
