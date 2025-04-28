<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper'

const pushRouter = usePushRouter();
</script>
<template>
    <!-- TODO: Clear setting once done -->
    <h1>Activity Done</h1>
    <p>🏁</p>
    <button @click="pushRouter('/activity/ranked')">To Leaderboard!</button>
</template>