<script setup lang="ts">
const props = defineProps<{
    imagePath: string
    gamePath: string
    gameName: string
    i18nKey: string
}>()
</script>
<template>
    <div @click="$router.push(props.gamePath)"
         class="game-selector-container">
        <img
            :src="props.imagePath"
            :alt="props.gameName"
            class="game-selector">
        <p class="game-name">{{ $t(props.i18nKey) }}</p>
    </div>
</template>
<style lang="scss" scoped>
.game-selector {
    width: 100%;
    max-width: 280px;
    height: auto;
    display: block;
}

.game-selector-container {
    cursor: pointer;
}
</style>
