import { defineStore } from 'pinia';

interface Player {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
  players: Player[];
  score: number;
}

interface GameMode {
  id: number;
  name: string;
}

const gameModes: GameMode[] = [
  { id: 1, name: 'pantomime' },
  { id: 2, name: 'describe' },
  { id: 3, name: 'draw' },
];

interface GameSettings {
  groups: Group[];
  rounds: number;
  timePerRound: number;
  gameModes: string[];
  currentRound: number;
  currentPlayerIndex: number; // Index for rotating through players
  currentGameMode?: GameMode;
}

export const useGameStore = defineStore('game', {
  state: () => ({
    gameSettings: {
      groups: [],
      rounds: 0,
      timePerRound: 0,
      gameModes: [],
      currentRound: 0,
      currentPlayerIndex: 0,
      currentGameMode: gameModes[Math.floor(Math.random() * gameModes.length)],
    } as GameSettings,
  }),
  persist: true,
  actions: {
    setGameSettings(settings: GameSettings) {
      this.gameSettings = settings;
    },
    clearGameSettings() {
      this.gameSettings = {} as GameSettings;
    },
    incrementScore(groupId: number) {
      const group = this.gameSettings.groups.find(group => group.id === groupId);
      if (group) {
        group.score += 1;
      }
    },
    init() {
      const gameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
      this.gameSettings.currentGameMode = gameMode;
    },
    nextPlayer() {
      const groups = this.gameSettings.groups;
      const maxPlayersInAnyGroup = Math.max(...groups.map(g => g.players.length));
      let index = this.gameSettings.currentPlayerIndex + 1;

      // Increment round
      if (index >= maxPlayersInAnyGroup) {
        index = 0;
        this.gameSettings.currentRound += 1;
      }

      this.gameSettings.currentPlayerIndex = index;

      // Change the game mode
      this.gameSettings.currentGameMode = gameModes[Math.floor(Math.random() * gameModes.length)];

      if (this.gameSettings.currentRound >= this.gameSettings.rounds) {
        return true; // Game over
      }

      return false; // Game continues
    },
    getScore(groupId: number) {
      const group = this.gameSettings.groups.find(group => group.id === groupId);
      return group ? group.score : 0;
    },
    getLeaderboard() {
      return this.gameSettings.groups
        .slice()
        .sort((a, b) => b.score - a.score)
        .map(group => ({
          name: group.name,
          score: group.score,
        }));
    }
  },
  getters: {
    getGroups(state) {
      return state.gameSettings.groups;
    },
    getRounds(state) {
      return state.gameSettings.rounds;
    },
    getTimePerRound(state) {
      return state.gameSettings.timePerRound;
    },
    getGameModes(state) {
      return state.gameSettings.gameModes;
    },
    getCurrentRound(state) {
      return state.gameSettings.currentRound;
    },
    getCurrentPlayer(state) {
      const index = state.gameSettings.currentPlayerIndex;
      for (const group of state.gameSettings.groups) {
        if (index < group.players.length) {
          return {
            player: group.players[index],
            groupId: group.id,
          };
        }
      }
      return null;
    },
    getCurrentGameMode(state) {
      return state.gameSettings.currentGameMode;
    },
  }
});