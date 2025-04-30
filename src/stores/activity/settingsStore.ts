import { defineStore } from 'pinia';

interface Player {
  id: number;
  name: string;
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
  players: Player[];
  rounds: number;
  timePerRound: number;
  gameModes: string[];
  currentRound: number;
  currentPlayer: number;
  currentGameMode?: GameMode;
}

export const useGameStore = defineStore('game', {
  state: () => ({
    gameSettings: {
      players: [],
      rounds: 0,
      timePerRound: 0,
      gameModes: [],
      currentRound: 0,
      currentPlayer: 0,
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
    incrementScore(playerId: number) {
      const player = this.gameSettings.players.find(player => player.id === playerId);
      if (player) {
        player.score += 1;
      }
    },
    init() {
      const gameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
      this.gameSettings.currentGameMode = gameMode;
    },
    nextPlayer() {
      const totalPlayers = this.gameSettings.players.length;
      // Wrap around to the first player if we reach the end of the list
      this.gameSettings.currentPlayer = (this.gameSettings.currentPlayer + 1) % totalPlayers;
      const gameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
      this.gameSettings.currentGameMode = gameMode;

      if (this.gameSettings.currentPlayer === 0) {
        this.gameSettings.currentRound += 1;
      }

      if (this.gameSettings.currentRound >= this.gameSettings.rounds) {
        return true; // Game is over
      }

      return false; // Game continues
  },
  getScore(playerId: number) {
      const player = this.gameSettings.players.find(player => player.id === playerId);
      return player ? player.score : 0;
  },
  getLeaderboard() {
      return this.gameSettings.players.sort((a, b) => b.score - a.score).map(player => {
        return {
          name: player.name,
          score: player.score,
        };
      });
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
    },
    getCurrentRound(state) {
      return state.gameSettings.currentRound;
    },
    getCurrentPlayer(state) {
      return state.gameSettings.players[state.gameSettings.currentPlayer];
    },
    getCurrentGameMode(state) {
      return state.gameSettings.currentGameMode;
    },
  }
});
