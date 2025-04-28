<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadWordList } from '@/helpers/Activity/wordListHelper';
import { usePushRouter } from '@/helpers/routerHelper'

const pushRouter = usePushRouter();

// Create a reactive variable to hold the word list
const wordList = ref<string[]>([]);
const isPWA =ref(false);

onMounted(() => {
  loadWordList().then((result) => {
    if (result) {
      wordList.value = result;
    }
  });
  isPWA.value = window.matchMedia('(display-mode: standalone)').matches || ((navigator as any).standalone == true);
});
</script>

<template>
  <h1>Yay! In Game view 🥳</h1>
  <div>
    <h2>Word List</h2>
    <p>Is PWA: {{ isPWA.toString() }}</p>
    <ul>
      <!-- Render the word list dynamically -->
      <li v-for="(word, index) in wordList" :key="index">{{ word }}</li>
    </ul>
    <button @click="pushRouter('/')">Go to Home</button>
  </div>
</template>
