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

interface GameStore {
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

export const useGameStore = defineStore('macherlies-game-store', {
    state: (): { gameStore: GameStore } => ({
        gameStore: {
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
        getGroups: (state) => state.gameStore.groups,
        getRounds: (state) => state.gameStore.rounds,
        getTimePerRound: (state) => state.gameStore.timePerRound,
        getGameModes: (state) => state.gameStore.gameModes,
        getAllowedWordLists: (state) => state.gameStore.allowedWordLists,
        getMaxPlayersGroup: (state) => state.gameStore.maxPlayersGroup,
        getCurrentRound: (state) => state.gameStore.currentRound,
        getCurrentGroupIndex: (state) => state.gameStore.currentGroupIndex,
        getCurrentGameMode: (state) => state.gameStore.currentGameMode,
        getCurrentWordList: (state) => state.gameStore.currentWordList,
        getCurrentSkipsLeft: (state) => state.gameStore.currentSkipsLeft,
    },
    actions: {
        // Private Functions
        // Only use internally
        initGame() {
            // Set id and score for each group
            let maxPlayers = 0;
            this.gameStore.groups = this.gameStore.groups.map((group, index) => {
                // Set id for each player in each group
                const playersWithIds = group.players.map((player, playerIndex) => ({
                    ...player,
                    id: playerIndex,
                }));

                // Check if this is the longest group in the game
                // If both groups have the same length, the second on is used to everyone get their turn
                if (group.players.length >= maxPlayers) {
                    maxPlayers = group.players.length;
                    this.gameStore.maxPlayersGroup = index;
                }

                return {
                    ...group,
                    id: index,
                    score: 0,
                    currentPlayerIndex: 0,
                    players: playersWithIds,
                };
            });

            this.initTurn();
        },
        initTurn() {
            // Set a random game mode
            this.gameStore.currentGameMode = 
                this.gameStore.gameModes[
                    Math.floor(Math.random() * this.gameStore.gameModes.length)
                ];
            
            // Set available skips
            this.gameStore.currentSkipsLeft = 3;
        },
        gameComplete() {
            // TODO: What to do if game is finished
            // Return leaderboard and give it with props to next element
        },
        // Public Functions
        setgameStore(settings: GameStore) {
            this.gameStore = {
                ...this.gameStore,
                ...settings
            };

            this.initGame()
        },
        changeScore(score: number) {
            // Change score of current group
            const currentGroup = this.gameStore.groups[this.gameStore.currentGroupIndex || 0];
            if (currentGroup) {
                currentGroup.score = (currentGroup.score || 0) + score;
            }
        },
        skipWord() {
            // If skips left, decrement skips left
            if (this.gameStore.currentSkipsLeft && this.gameStore.currentSkipsLeft > 0) {
                this.gameStore.currentSkipsLeft -= 1;
            } else {
                // If no skips left, decrement group score
                this.changeScore(-1);
            }
        },
        continueToNextPlayer() {
            this.initTurn();

            // Increment current player index
            const currentGroup = this.gameStore.groups[this.gameStore.currentGroupIndex || 0];
            if (currentGroup) {
                currentGroup.currentPlayerIndex = (currentGroup.currentPlayerIndex || 0) + 1;

                console.log(`Current player index: ${currentGroup.currentPlayerIndex} in group ${currentGroup.id}`);

                // If current player index is bigger than group players, reset to 0
                if (currentGroup.currentPlayerIndex >= currentGroup.players.length) {
                    currentGroup.currentPlayerIndex = 0;

                    // If last player of biggest group finished, increment round
                    if (currentGroup.id === this.gameStore.maxPlayersGroup) {
                        console.log('Last player of biggest group finished, incrementing round');
                        this.gameStore.currentRound = (this.gameStore.currentRound ?? 0) + 1;

                        // If last round, finish game
                        if (this.gameStore.currentRound >= this.gameStore.rounds) {
                            this.gameComplete();
                        }
                    }
                }
            } else {
                console.error('Current group not found');
            }

            // If not last round, continue to next group
            this.gameStore.currentGroupIndex = (this.gameStore.currentGroupIndex || 0) + 1;

            if (this.gameStore.currentGroupIndex >= this.gameStore.groups.length) {
                this.gameStore.currentGroupIndex = 0;
            }
        },
        gameExit() {

        }
    }
})