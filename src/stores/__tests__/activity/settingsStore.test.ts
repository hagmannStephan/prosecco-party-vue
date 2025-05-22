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

// TODO: Also try to initialize non-valid groups

describe('Macherlies Settings Store', () => {
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

    describe('simulate game flow', () => {
    const store = createTestStore()
    })

   
})

// TODO: Remove comment from wordListStore.test.ts