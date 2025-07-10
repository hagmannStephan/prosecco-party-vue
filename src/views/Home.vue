<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import GameSelector from '@/components/GameSelector.vue';
</script>
<template>
  <LanguageSwitcher />
  <GameSelector
    imagePath="images/schnapsidee-placeholder.png"
    gamePath="/schnapsidee/game-config"
    gameName="Schnapsidee"
    i18nKey="home.schnapsidee-redirect" />
    <GameSelector
    imagePath="images/nachtrueh-placeholder.png"
    gamePath="/nachtrueh"
    gameName="Nachtrueh"
    i18nKey="home.nachtrueh-redirect" />
</template>
