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
  // Current Player (or last current player) in group
  // Goes from start to end
  currentPlayerIndex?: number;
}

const gameModes = ['pantomime', 'describe', 'draw'];
// TODO: Update this based on the available categories
// -> Important: Update always when something changes (could be that in config there happens a change)
const wordCategories = ['standard', 'activity', 'sport', 'spicy'];

interface GameSettings {
    // Game Config
    // ------------------
    groups: Group[],
    rounds: number,
    timePerRound: number,
    gameModes: string[],
    allowedWordLists: string[],
    
    // Game State
    // ------------------
    // To keep track of when to change the round
    // Change round when last player of bigger group finished turn
    maxPlayersGroup?: number,
    currentRound?: number,
    currentGroupIndex?: number,
    currentGameMode?: string,
    currentWordList?: string,
    // Each player gets per round three free skips
    // If they are used up, each skip costs the group a point
    currentSkipsLeft?: number,
}

export const useGameStore = defineStore('macherlies', {
     state: (): { gameSettings: GameSettings } => ({
        gameSettings: {
            // Game Config
            groups: [] as Group[],
            rounds: 0,
            timePerRound: 0,
            gameModes: [],
            allowedWordLists: [],
            // Game State
            maxPlayersGroup: 0,
            currentRound: 0,
            currentGroupIndex: 0,
            currentGameMode: '',
            currentWordList: '',
            currentSkipsLeft: 0,
        }
    }),
    persist: true,
    getters: {
        getGroups: (state) => state.gameSettings.groups,
        getRounds: (state) => state.gameSettings.rounds,
        getTimePerRound: (state) => state.gameSettings.timePerRound,
        getGameModes: (state) => state.gameSettings.gameModes,
        getAllowedWordLists: (state) => state.gameSettings.allowedWordLists,
        getMaxPlayersGroup: (state) => state.gameSettings.maxPlayersGroup,
        getCurrentRound: (state) => state.gameSettings.currentRound,
        getCurrentGroupIndex: (state) => state.gameSettings.currentGroupIndex,
        getCurrentGameMode: (state) => state.gameSettings.currentGameMode,
        getCurrentWordList: (state) => state.gameSettings.currentWordList,
        getCurrentSkipsLeft: (state) => state.gameSettings.currentSkipsLeft,
    },
    actions: {
        // Private Functions
        // Only use internally
        init() {
            // TODO: Init the store
        },
        gameComplete() {
            // TODO: What to do if game is finished
            // Return leaderboard and give it with props to next element
        },
        // Public Functions
        setGameSettings(settings: GameSettings) {
            // TODO: Validate settings
            this.gameSettings = {
                ...this.gameSettings,
                ...settings
            };
            
            this.init()
        },
        changeScore(score: number) {
            // TODO: Change the score of the current group by param
        },
        skipWord() {
            // TODO: Skip the current word
        },
        initializeNextTurn() {
            // TODO: Initialize the next turn
        },
        gameExit() {

        }
    }
})