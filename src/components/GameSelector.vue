<script setup lang="ts">
const props = defineProps<{
    imagePath: string
    gamePath: string
    gameName: string
    i18nKey: string
}>()
</script>
<template>
    <img
        :src="props.imagePath"
        :alt="props.gameName"
        @click="$router.push(props.gamePath)"
        class="game-selector">
    <p class="game-name">{{ $t(props.i18nKey) }}</p>
</template>
<style lang="scss" scoped>
.game-selector {
    width: 100%;
    max-width: 280px;
    height: auto;
    cursor: pointer;
    display: block;
}
</style>
