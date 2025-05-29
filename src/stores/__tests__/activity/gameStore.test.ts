import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
import { useGameStore } from '@/stores/activity/gameStore'

// Mock valid game store
function createTestStore() {
    const store = useGameStore()
    store.setGameStore({
        groups: [
            {
                name: 'Gang gang 🤙',
                players: [
                    { name: "Steffla Chef"},
                    { name: "Liam de Lappe"},
                    { name: "Joan de Chefé"}
                ]
            },
            {
                name: "Gong Gang 🎵",
                players: [
                    { name: "Stöff"},
                    { name: "Töff"},
                    { name: "Röff"},
                    { name: "Schmöff"}
                ]
            }
        ],
        rounds: 3,
        timePerRound: 60,
        gameModes: ['pantomime', 'describe'],   // Left out draw
        allowedWordLists: ['standard', 'activity', 'spicy'],    // Left out sport
    })
    return store
}

describe('Macherlies Settings Store - Game Flow', () => {

    describe('getters', () => {
        let store: ReturnType<typeof useGameStore>

        beforeEach(() => {
            setActivePinia(createPinia())
            store = createTestStore()
        })

        it('should return the corrent groups from the getter', () => {
            const store = createTestStore()
            expect(store.getGroups.length).toBe(2)
        })

        it('should return the correct amount of rounds from the getter', () => {
            const store = createTestStore()
            expect(store.getRounds).toBe(3)
        })

        it('should return the correct time per round from the getter', () => {
            const store = createTestStore()
            expect(store.getTimePerRound).toBe(60)
        })

        it('should return the correct game modes from the getter', () => {
            const store = createTestStore()
            expect(store.getGameModes.length).toBe(2)
        })

        it('should return the correct allowed word list categories from the getter', () => {
            const store = createTestStore()
            expect(store.getAllowedWordLists.length).toBe(3)
        })
    })

    describe('init game', () => {
        it('should set the game state correctly', () => {
            const store = createTestStore()

            expect(store.gameStore.maxPlayersGroup).toBe(1)
            expect(store.gameStore.currentRound).toBe(0)
            expect(store.gameStore.currentGroupIndex).toBe(0)
            expect(['pantomime', 'describe']).toContain(store.gameStore.currentGameMode)
            expect(store.gameStore.currentSkipsLeft).toBe(3)
        })

        it('should set the group metadata correctly', () => {
            const store = createTestStore()
            const group = store.getGroups

            expect(group[0].id).toBe(0)
            expect(group[0].score).toBe(0)
            expect(group[1].id).toBe(1)
            expect(group[1].score).toBe(0)
        })

        it('should set the player metadata correctly', () => {
            const store = createTestStore()
            const group = store.getGroups

            group.forEach((group) => {
                group.players.forEach((player, playerIndex) => {
                    expect(player.id).toBe(playerIndex)
                })
            })
        })
    })

    describe('simulate game flow for first round', () => {
        let store: ReturnType<typeof useGameStore>

        beforeAll(() => {
            setActivePinia(createPinia())
            store = createTestStore()
        })
            
        it('check if first turn is initialized correctly', () => {
            expect(store.gameStore.currentRound).toBe(0)
            expect(store.gameStore.currentGroupIndex).toBe(0)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].currentPlayerIndex).toBe(0)
        })

        it('check if points get added correctly', () => {
            for (let i = 0; i < 3; i++) {
                store.changeScore(1)
            }

            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].score).toBe(3)
        })

        it('check if points get subtracted correctly', () => {
            for (let i = 0; i < 4; i++) {
                store.changeScore(-1)
            }

            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].score).toBe(-1)
        })

        it('check if skips work as expected', () => {
            expect(store.getCurrentSkipsLeft).toBe(3)
            
            store.skipWord()

            expect(store.getCurrentSkipsLeft).toBe(2)
        })

        it('check if score subtraction works when skips are used up', () => {
            for (let i = 0; i < 3; i++) {
                store.skipWord()
            }

            expect(store.getCurrentSkipsLeft).toBe(0)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].score).toBe(-2)
        })

        it('check if second turn initializes correctly', () => {
            store.continueToNextPlayer()

            expect(store.getCurrentRound).toBe(0)
            expect(store.getCurrentGroupIndex).toBe(1)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].currentPlayerIndex).toBe(0)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].score).toBe(0)
            expect(store.getCurrentSkipsLeft).toBe(3)
        })
    })

    describe('simulate flow for second round', () => {
        let store: ReturnType<typeof useGameStore>

        beforeAll(() => {
            setActivePinia(createPinia())
            store = createTestStore()
        })

        it('should initialize the second round correctly', () => {
            store.changeScore(5)

            for(let i = 0; i < 8; i++) {
                store.continueToNextPlayer()
            }

            expect(store.getCurrentRound).toBe(1)
            expect(store.getCurrentGroupIndex).toBe(0)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].currentPlayerIndex).toBe(1)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].score).toBe(5)
        })

        it('should initialize the second turn of the second round correctly', () => {
            store.continueToNextPlayer()

            expect(store.getCurrentRound).toBe(1)
            expect(store.getCurrentGroupIndex).toBe(1)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].currentPlayerIndex).toBe(0)
        })
    })

    describe('simulate game flow until finished', () => {
        // A game with three rounds takes 8 * 3 turns to finish in this config

        function validateGameState(store: ReturnType<typeof useGameStore>) {
            expect(['pantomime', 'describe']).toContain(store.gameStore.currentGameMode)
            expect(['standard', 'activity', 'spicy']).toContain(store.gameStore.currentWordList)
            // store.continueToNextPlayer()
            const groupIndex = store.getCurrentGroupIndex ?? 0
            const group = store.getGroups[groupIndex]
            const playerIndex = group?.currentPlayerIndex ?? 0
            const playerName = group?.players?.[playerIndex]?.name
            console.log("Current player:", playerName, ' with  currentPlayerIndex:', playerIndex, ' in group:', group?.name, ' with score:', group?.score)
        }

        it('should finish the game correctly (for the first group win)', () => {
            const store = createTestStore()
            console.log("Store before game start:", store.gameStore)

            // Change score for the first group
            store.changeScore(5)

            const groupIndex = store.getCurrentGroupIndex ?? 0
                const group = store.getGroups[groupIndex]
                const playerIndex = group?.currentPlayerIndex ?? 0
                const playerName = group?.players?.[playerIndex]?.name
                console.log("Start player:", playerName, ' with  currentPlayerIndex:', playerIndex, ' in group:', group?.name, 'with id', group.id, ' with score:', group?.score)

            for (let i = 0; i < (23); i++) {
                // validateGameState(store)
                const leaderboard = store.continueToNextPlayer()
                console.log('Did maybe a leaderboard occur before: ', leaderboard)
                const groupIndex = store.getCurrentGroupIndex ?? 0
                const group = store.getGroups[groupIndex]
                const playerIndex = group?.currentPlayerIndex ?? 0
                const playerName = group?.players?.[playerIndex]?.name
                console.log("Current player:", playerName, ' with  currentPlayerIndex:', playerIndex, ' in group:', group?.name, 'with id', group.id, ' with score:', group?.score)
            }

            console.log('Before second score - Current group:', store.getCurrentGroupIndex, store.getGroups[store.getCurrentGroupIndex ?? 0].name)
            store.changeScore(2)
            const leaderboard = store.continueToNextPlayer()

            console.log('Leaderboard before check: ', leaderboard)
            expect(leaderboard).toEqual(
                [
                    {
                        "name": "Gang gang 🤙",
                        "players": [ "Steffla Chef", "Liam de Lappe", "Joan de Chefé" ],
                        "score": 5,
                    },
                    {
                        "name": "Gong Gang 🎵",
                        "players": [ "Stöff", "Töff", "Röff", "Schmöff" ],
                        "score": 2,
                    }
                ]
            )
        })

    //     it('should finish the game correctly (for the second group)', () => {
    //         const store = createTestStore()

    //         store.changeScore(3)

    //         for (let i = 0; i < (23); i++) {
    //             validateGameState(store)
    //         }

    //         store.changeScore(4)
    //         const leaderboard = store.continueToNextPlayer()

    //         expect(leaderboard).toBe(
    //             [
    //                 {
    //                     "name": "Gong Gang 🎵",
    //                     "players": [ "Stöff", "Töff", "Röff", "Schmöff" ],
    //                     "score": 4,
    //                 },
    //                 {
    //                     "name": "Gang gang 🤙",
    //                     "players": [ "Steffla Chef", "Liam de Lappe", "Joan de Chefé" ],
    //                     "score": 2,
    //                 }
    //             ]
    //         )
    //     })

    //     it('should finish the game correctly (if a draw)', () => {
    //         const store = createTestStore()

    //         store.changeScore(6)

    //         for (let i = 0; i < (23); i++) {
    //             validateGameState(store)
    //         }

    //         store.changeScore(6)
    //         const leaderboard = store.continueToNextPlayer()

    //                     expect(leaderboard).toBe(
    //             [
    //                 {
    //                     "name": "Gang gang 🤙",
    //                     "players": [ "Steffla Chef", "Liam de Lappe", "Joan de Chefé" ],
    //                     "score": 6,
    //                 },
    //                 {
    //                     "name": "Gong Gang 🎵",
    //                     "players": [ "Stöff", "Töff", "Röff", "Schmöff" ],
    //                     "score": 6,
    //                 }
    //             ]
    //         )
    //     })
    })
})
    
describe('Macherlies Settings Store - Game Exit', () => {
    it('should reset the game settings when exiting', () => {
        const store = createTestStore()
        store.changeScore(5)
        store.continueToNextPlayer()
        
        store.gameExit()

        expect(store.gameStore).toEqual({
            groups: [],
            rounds: 0,
            timePerRound: 0,
            gameModes: [],
            allowedWordLists: [],
            maxPlayersGroup: 0,
            currentRound: 0,
            currentGroupIndex: 0,
            currentGameMode: '',
            currentWordList: '',
            currentSkipsLeft: 0
        })
    })
})

// TODO: Remove comment from wordListStore.test.ts
// TODO: Change name to something like `GameStore.test.ts` (if not too difficult)