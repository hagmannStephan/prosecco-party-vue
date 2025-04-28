import { defineStore } from 'pinia';

interface GameSettings {
  players: string[];
  rounds: number;
  timePerRound: number;
  gameModes: string[];
}

export const useGameStore = defineStore('game', {
  state: () => ({
    gameSettings: {} as GameSettings,
  }),
  actions: {
    setGameSettings(settings: GameSettings) {
      this.gameSettings = settings;
    },
    clearGameSettings() {
      this.gameSettings = {} as GameSettings;
    }
  },
  getters: {
    getPlayers(state) {
      return state.gameSettings.players;
    },
    getRounds(state) {
      return state.gameSettings.rounds;
    },
    getTimePerRound(state) {
      return state.gameSettings.timePerRound;
    },
    getGameModes(state) {
      return state.gameSettings.gameModes;
    }
  }
});
