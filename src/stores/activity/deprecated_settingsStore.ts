import { defineStore } from 'pinia';

interface Player {
  id?: number;
  name: string;
}

interface Group {
  id?: number;
  name: string;
  score?: number;
  players: Player[];
  currentPlayerIndex?: number;
}

interface GameMode {
  id: number;
  name: string;
}

// Updated game modes list to match the gameModes provided in settings
const getAvailableGameModes = (modes: string[]): GameMode[] => {
  const allGameModes: Record<string, GameMode> = {
    'pantomime': { id: 1, name: 'pantomime' },
    'describe': { id: 2, name: 'describe' },
    'draw': { id: 3, name: 'draw' }
  };

  return modes.map(mode => allGameModes[mode]).filter(mode => mode !== undefined);
};

interface GameSettings {
  groups: Group[];
  rounds: number;
  timePerRound: number;
  gameModes: string[];
  wordCategories: string[];
  currentRound?: number;
  currentGroupIndex?: number;
  currentGameMode?: GameMode;
  // After every player of this group has played, increment the round
  // Get the last group with this amount of players, because it could be that there is a group with the same amout of players later that gets skipped
  maxPlayersGroupId?: number;
  availableWords?: string[];
}

export const useGameStore = defineStore('game', {
  state: () => ({
    gameSettings: {
      // Settings config
      groups: [] as Group[],
      players: [] as Player[],
      rounds: 0,
      timePerRound: 0,
      gameModes: [],  // pantomime, draw, describe
      wordCategories: [], // standard, activity, sport, spicy, etc.
      // Game state
      currentRound: 0,
      currentGroupIndex: 0,
      currentGameMode: {} as GameMode,
      // Id of group with the most player
      // If multiple groups have the same amount of players, take the last one
      maxPlayersGroupId: 0,
    } as GameSettings,
  }),
  persist: true,
  actions: {
    // Private method - dont use except for in `setGameSettings`
    initGameStore() {
      const availableGameModes = getAvailableGameModes(this.gameSettings.gameModes);
      
      if (availableGameModes.length > 0) {
        this.gameSettings.currentGameMode = availableGameModes[Math.floor(Math.random() * availableGameModes.length)];
      } else {
        // Fallback to pantomime if no valid game modes are provided
        this.gameSettings.currentGameMode = { id: 1, name: 'pantomime' };
      }
      
      this.gameSettings.currentGroupIndex = 0;
      this.gameSettings.currentRound = 0;

      let maxPlayersGroup = {Id: 0, players: 0}

      // Assign initial scores to groups and id's
      this.gameSettings.groups.forEach((group, index) => {
        group.score = 0;
        group.id = index;
        group.currentPlayerIndex = 0;

        // Assign unique IDs to players
        group.players.forEach((player, playerIndex) => {
          player.id = playerIndex;
        });

        if (group.players.length >= maxPlayersGroup.players) {
          maxPlayersGroup.players = group.players.length;
          maxPlayersGroup.Id = group.id;
        }
      });

      this.gameSettings.maxPlayersGroupId = maxPlayersGroup.Id;
    },
    // Initialize with this (not with initGameStore())
    setGameSettings(settings: GameSettings) {
      this.gameSettings = {
        ...settings,
      };
      this.initGameStore();
    },
    clearGameSettings() {
      this.gameSettings = {} as GameSettings;
    },
    incrementScore() {
      const group = this.getGroupById(this.gameSettings.currentGroupIndex || 0);

      if (group && group.score) {
        group.score += 1;
      } else if (group) {
        group.score = 1
      }
    },
    nextPlayer() {
      const oldGroup = this.getGroupById(this.gameSettings.currentGroupIndex || 0);
    
      if (oldGroup) {
        // Switch to the next player in the group
        oldGroup.currentPlayerIndex = (oldGroup.currentPlayerIndex || 0) + 1;
    
        // Check if the currentPlayerIndex is out of bounds
        if (oldGroup.players.length <= (oldGroup.currentPlayerIndex || 0)) {
          // Reset the current player index for this group
          oldGroup.currentPlayerIndex = 0;
          
          // Check if this is the maxPlayerGroup
          if (oldGroup.id === this.gameSettings.maxPlayersGroupId) {
            // Increment round
            this.gameSettings.currentRound = (this.gameSettings.currentRound || 0) + 1;
            
            // Check if we've completed all rounds
            if (this.gameSettings.currentRound >= this.gameSettings.rounds) {
              return true; // Game over
            }
          }
        }
      }
    
      // Switch to the next group
      this.gameSettings.currentGroupIndex = (this.gameSettings.currentGroupIndex || 0) + 1;
    
      // Check if the currentGroupIndex is out of bounds
      if (this.gameSettings.groups.length <= (this.gameSettings.currentGroupIndex || 0)) {
        this.gameSettings.currentGroupIndex = 0;
      }
    
      const group = this.getGroupById(this.gameSettings.currentGroupIndex || 0);
    
      if (group) {
        if (group?.currentPlayerIndex == null) {
          group.currentPlayerIndex = 0;
        }
    
        // Change the game mode - use only the available game modes from settings
        const availableGameModes = getAvailableGameModes(this.gameSettings.gameModes);
        if (availableGameModes.length > 0) {
          this.gameSettings.currentGameMode = availableGameModes[Math.floor(Math.random() * availableGameModes.length)];
        }
      }
    
      return false; // Continue game
    },
    getLeaderboard() {
      return this.gameSettings.groups
        .slice()
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map(group => ({
          name: group.name,
          score: group.score || 0,
        }));
    }
  },
  getters: {
    getGroups(state) {
      return state.gameSettings.groups;
    },
    getCurrentGroup(state) {
      return state.gameSettings.groups[state.gameSettings.currentGroupIndex || 0];
    },
    getGroupById: (state) => (id: number) => {
      return state.gameSettings.groups.find(group => group.id === id) || null;
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
      const group = state.gameSettings.groups[state.gameSettings.currentGroupIndex || 0];
      if (group) {
        return group.players[group.currentPlayerIndex || 0];
      }
      return null;
    },
    getCurrentGameMode(state) {
      return state.gameSettings.currentGameMode;
    },
    getWordCategories(state) {
      return state.gameSettings.wordCategories;
    }
  }
});