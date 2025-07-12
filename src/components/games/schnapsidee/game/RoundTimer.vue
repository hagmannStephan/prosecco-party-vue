<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGameStore } from '@/stores/gameStore';
import { useRouter } from 'vue-router'

const { t } = useI18n();
const router = useRouter()

const timerInterval = ref<ReturnType<typeof setInterval> | null>(null);
const timeRemaining = ref(0);

const props = defineProps<{
  gameStore: ReturnType<typeof useGameStore>;
}>();

function continueGame() {
  const state = props.gameStore.continueToNextPlayer();
  if (state.gameOver) {
    router.push({ path: '/schnapsidee/done'})
  } else {
    router.push({ path: '/schnapsidee/time-up'})
  }
}

function startTimer(timePerRound: number) {
  // Get the configured time from the store
  timeRemaining.value = timePerRound;
 
  // Update timer every second
  timerInterval.value = setInterval(() => {
    timeRemaining.value--;
   
    // When time is up, proceed to next player
    if (timeRemaining.value <= 0) {
      if (timerInterval.value !== null) {
        clearInterval(timerInterval.value);
      }
      continueGame();
    }
  }, 1000);
}

onMounted(() => {
    startTimer(props.gameStore.getTimePerRound)
})

onUnmounted(() => {
  if (timerInterval.value !== null) {
    clearInterval(timerInterval.value);
  }
});
</script>
<template>
    <p>⌛ {{ timeRemaining + t('schnapsidee.game.seconds') }}</p>
</template>