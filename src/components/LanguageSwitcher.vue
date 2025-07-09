<template>
    <button @click="toggleLanguage">
      {{ currentLocale === 'de' ? 'English' : 'Deutsch (CH)' }}
    </button>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useLanguageSettingsStore } from '@/stores/languageSettingsStore'
  
  const { locale } = useI18n()
  const languageSettingsStore = useLanguageSettingsStore()
  
  // Use a computed to reactively track the current locale
  const currentLocale = computed(() => locale.value)
  
  function toggleLanguage() {
    const newLocale = locale.value === 'de' ? 'en' : 'de'
    locale.value = newLocale
    languageSettingsStore.setLanguage(newLocale)
  }
  </script>
  