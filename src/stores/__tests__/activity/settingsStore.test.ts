import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/activity/settingsStore'

function createTestStore() {
    const store = useGameStore()
    store.setGameSettings({
        groups: [
            { id: 1, name: 'Team A', players: [{ id: 1, name: 'Alice' }], score: 0 },
            { id: 2, name: 'Team B', players: [{ id: 2, name: 'Bob' }], score: 0 }
        ],
        rounds: 3,
        timePerRound: 60,
        gameModes: ['pantomime', 'draw', 'describe'],
        currentRound: 0,
        currentPlayerIndex: 0,
        currentGroupIndex: 0,
        currentGameMode: undefined
    })
    return store
}

describe('Game Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('initialization', () => {
        it('should return the correct number of rounds', () => {
            const store = createTestStore()
            expect(store.getRounds).toBe(3)
        })

        it('should return the correct time per round', () => {
            const store = createTestStore()
            expect(store.getTimePerRound).toBe(60)
        })
    })

    describe('score handling', () => {
        it('should increment the group score', () => {
            const store = createTestStore()
            store.incrementScore(1)
            expect(store.getScore(1)).toBe(1)
        })
    })
})
