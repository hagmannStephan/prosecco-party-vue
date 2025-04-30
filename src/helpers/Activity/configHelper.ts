import { useGameStore } from '@/stores/activity/activitySettingsStore';

export function isPiniaComplete(gS: ReturnType<typeof useGameStore>) {
   if (
        !gS.getPlayers.length ||
        gS.getRounds === undefined ||
        !gS.getTimePerRound ||
        !gS.getGameModes.length ||
        gS.getCurrentRound === undefined ||
        gS.getCurrentPlayer === undefined
    ) {
        return false; // Pinia is not complete
    } else {
        return true; // Pinia is complete
    }
}