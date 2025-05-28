import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/activity/settingsStore'

// Mock valid game store
function createTestStore() {
    const store = useGameStore()
    store.setGameSettings({
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
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('getters', () => {
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

            expect(store.gameSettings.maxPlayersGroup).toBe(1)
            expect(store.gameSettings.currentRound).toBe(0)
            expect(store.gameSettings.currentGroupIndex).toBe(0)
            expect(store.gameSettings.currentGameMode).toContain(['pantomime', 'describe'])
            expect(store.gameSettings.currentSkipsLeft).toBe(3)
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
    const store = createTestStore()
    store.init()

        it('check if first turn is initialized correctly', () => {
            expect(store.gameSettings.currentRound).toBe(0)
            expect(store.gameSettings.currentGroupIndex).toBe(0)
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
            store.initializeNextTurn()

            expect(store.getCurrentRound).toBe(0)
            expect(store.getCurrentGroupIndex).toBe(1)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].currentPlayerIndex).toBe(0)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].score).toBe(0)
            expect(store.getCurrentSkipsLeft).toBe(3)
        })
    })

    describe('simulate flow for second round', () => {
    const store = createTestStore()
    store.init()

        it('should initialize the second round correctly', () => {
            store.changeScore(5)

            for(let i = 0; i < 8; i++) {
                store.initializeNextTurn()
            }

            expect(store.getCurrentRound).toBe(1)
            expect(store.getCurrentGroupIndex).toBe(0)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].currentPlayerIndex).toBe(1)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].score).toBe(5)
        })

        it('should initialize the second turn of the second round correctly', () => {
            store.initializeNextTurn()

            expect(store.getCurrentRound).toBe(1)
            expect(store.getCurrentGroupIndex).toBe(0)
            expect(store.getGroups[store.getCurrentGroupIndex ?? 0].currentPlayerIndex).toBe(0)
        })
    })

    describe('simulate game finished', () => {
        it('should finish the game correctly (for the first group)', () => {
        })

        it('should finish the game correctly (for the second group)', () => {
        })
    })
})

// TODO: Add input-validation tests (what if non valid group, etc.)
// TODO: Remove comment from wordListStore.test.ts