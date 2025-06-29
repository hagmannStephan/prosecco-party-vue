<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Group } from '@/models/schnapsidee/group'

const { t } = useI18n();
const props = defineProps<{
  groups: Group[];
}>();

// Add a player to a group
const addPlayer = (groupId: number) => {
    const group = props.groups.find(g => g.id === groupId);
    if (group) {
        const newId = group.players.length;
        group.players.push({ id: newId, name: '' });
    }
};

// Remove a player from a group (minimum 2 players required)
const removePlayer = (groupId: number, playerId: number) => {
  const group = props.groups.find(g => g.id === groupId);
  if (group && group.players.length > 2) {
    group.players = group.players.filter(player => player.id !== playerId);
    // Reassign IDs to ensure sequential ordering
    group.players.forEach((player, index) => {
      player.id = index;
    });
  }
};

// Get placeholder of textfield for player name
function getPlayerPlaceholder(index: number) {
  if (index === 0) return t('schnapsidee.config.player.placeholder.1');
  if (index === 1) return t('schnapsidee.config.player.placeholder.2');
  return t('schnapsidee.config.player.placeholder.3+');
}
</script>
<template>
    <div class="form-section groups-section">
      <h2>{{ t('schnapsidee.config.groups.setup') }}</h2>

      <div v-for="group in groups" :key="group.id" class="group-container">
        <p>{{ t('schnapsidee.config.groups.name') }}</p>
        <div class="group-header">
          <input v-model="group.name" type="text" :placeholder="t('schnapsidee.config.groups.name-placeholder')"
            class="group-name-input" required />
        </div>
        <p>{{ t('schnapsidee.config.player.name') }}</p>
        <div class="group-players">
          <div v-for="(player, idx) in group.players" :key="player.id" class="player-input">
            <input v-model="player.name" type="text" :placeholder="getPlayerPlaceholder(idx)" required />
            <button v-if="group.players.length > 2" @click="() => removePlayer(group.id, player.id)"
              class="remove-button">×</button>
          </div>

          <button @click="() => addPlayer(group.id)" class="add-player-button">
            + {{ t('schnapsidee.config.player.add') }}
          </button>
        </div>
      </div>
    </div>
</template>