import type { Group } from '@/models/schnapsidee/group';
import { useI18n } from 'vue-i18n';

// Submit the form and start the game
export const validateGameConfig = (
    groups: Group[], 
    selectedGameModes: String[], 
    selectedWordLists: String[],
    rounds: number,
    t: ReturnType<typeof useI18n>['t']
) => {
  // Validate that each group has at least two players
  if (groups.some(group => group.players.length < 2)) {
    alert(t('schnapsidee.config.error.min-players-per-group-two'));
    return false;
  }

  // Validate that all players have names
  for (const group of groups) {
    if (group.players.some(player => !player.name.trim())) {
      alert(t('schnapsidee.config.error.name-required'));
      return false;
    }
  }

  // Validate that all groups have names
  if (groups.some(group => !group.name.trim())) {
    alert(t('schnapsidee.config.error.group-name-required'));
    return false;
  }

  // Validate that at least one game mode is selected
  if (selectedGameModes.length === 0) {
    alert(t('schnapsidee.config.error.mode-required'));
    return false;
  }

  // Validate that at least one word list is selected
  if (selectedWordLists.length === 0) {
    alert(t('schnapsidee.config.error.wordlist-required'));
    return false;
  }

  // Validate that at least one round is set
  if (rounds < 1) {
    alert(t('schnapsidee.config.error.rounds-range'));
    return false;
  }

  return true;
};