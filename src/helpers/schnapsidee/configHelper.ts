import { useGameStore } from '@/stores/schnapsidee/gameStore';

export function isPiniaComplete(gS: ReturnType<typeof useGameStore>) {
   if (
        !gS.getGroups ||
        !gS.getGroups.length ||
        gS.getGroups.some(group => !group.players || !group.players.length) || // Check each group has players
        gS.getRounds === undefined ||
        !gS.getTimePerRound ||
        !gS.getGameModes.length ||
        gS.getCurrentRound === undefined ||
        gS.getCurrentPlayer === undefined ||
        gS.getCurrentGameMode === undefined
    ) {
        return false; // Pinia is not complete
    } else {
        return true; // Pinia is complete
    }
}