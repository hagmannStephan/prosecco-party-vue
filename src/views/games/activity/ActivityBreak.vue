<script setup lang="ts">
import { usePushRouter } from '@/helpers/routerHelper';

const pushRouter = usePushRouter();
</script>
<template>
    <!-- TODO: Redirect to activity Config if empty or use standard values -->
    <h1>Activity Break</h1>
    <button @click="pushRouter('/activity')">Go to Activity Game</button>
</template>