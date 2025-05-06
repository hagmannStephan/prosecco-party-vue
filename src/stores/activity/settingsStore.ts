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
  currentGroupIndex: number; // New property to track which group we're on
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
      currentGroupIndex: 0, // Initialize group index
      currentGameMode: gameModes[Math.floor(Math.random() * gameModes.length)],
    } as GameSettings,
  }),
  persist: true,
  actions: {
    setGameSettings(settings: GameSettings) {
      this.gameSettings = {
        ...settings,
        currentGroupIndex: 0, // Make sure to initialize this
      };
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
      this.gameSettings.currentPlayerIndex = 0;
      this.gameSettings.currentGroupIndex = 0; // Initialize group index
    },
    nextPlayer() {
      // Move to next group
      this.gameSettings.currentGroupIndex++;
      
      // If we've gone through all groups
      if (this.gameSettings.currentGroupIndex >= this.gameSettings.groups.length) {
        // Reset to first group
        this.gameSettings.currentGroupIndex = 0;
        
        // Move to next player index
        this.gameSettings.currentPlayerIndex++;
        
        // If we've gone through all players in the groups
        const maxPlayersInAnyGroup = Math.max(...this.gameSettings.groups.map(g => g.players.length));
        if (this.gameSettings.currentPlayerIndex >= maxPlayersInAnyGroup) {
          // Reset player index and increment round
          this.gameSettings.currentPlayerIndex = 0;
          this.gameSettings.currentRound++;
        }
      }
      
      // Change the game mode
      this.gameSettings.currentGameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
      
      // Check if game is over
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
      const playerIndex = state.gameSettings.currentPlayerIndex;
      const groupIndex = state.gameSettings.currentGroupIndex;
      
      // Make sure we have groups
      if (!state.gameSettings.groups || state.gameSettings.groups.length === 0) {
        return null;
      }
      
      // Make sure the group index is valid
      if (groupIndex < 0 || groupIndex >= state.gameSettings.groups.length) {
        return null;
      }
      
      const currentGroup = state.gameSettings.groups[groupIndex];
      
      // Make sure the player index is valid for this group
      if (playerIndex < 0 || playerIndex >= currentGroup.players.length) {
        return null;
      }
      
      return {
        player: currentGroup.players[playerIndex],
        groupId: currentGroup.id
      };
    },
    getCurrentGameMode(state) {
      return state.gameSettings.currentGameMode;
    },
  }
});