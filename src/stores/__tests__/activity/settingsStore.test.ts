import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/activity/settingsStore'

function createTestStore() {
    const store = useGameStore()
    store.setGameSettings({
        groups: [
            { name: 'De Ä$$', 
                players: [
                    { name: 'Liäm s \'' }
                    ]
            },
            { name: 'ÖpisÉ', 
                players: [
                    { name: 'Steffé de Chefé' },
                    { name: 'Joäü de §' },
                    { name: 'Chef de Steff' }
                ],
            },
            { name: 'SonderzeicheGang *"+&%ç()=?`', 
                players: [
                    { name: 'Steffla Chef' }
                ],
            },
            { name: 'NPCs', 
                players: [
                    { name: 'Jeff' },
                    { name: 'Deff' },
                    { name: 'Jeff' }
                ]
            },
        ],
        rounds: 3,
        timePerRound: 60,
        gameModes: ['pantomime', 'draw', 'describe'],
    })
    return store
}

// Group that relates tests together (to Game Store)
describe('Activity Settings Store', () => {
    // Runs before each test inside the desribe block
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('getters', () => {
        // Define single test case
        it('should return the correct number of rounds', () => {
            const store = createTestStore()
            expect(store.getRounds).toBe(3)
        })

        it('should return the correct time per round', () => {
            const store = createTestStore()
            expect(store.getTimePerRound).toBe(60)
        })
    })

    describe(('simulate game'), () => {
        let store: ReturnType<typeof useGameStore>

        setActivePinia(createPinia())
        store = createTestStore()

        it('first player turn', () => {
            expect(store.getCurrentPlayer?.name).toEqual('Liäm s \'')
        })

        it('increment score', () => {
            store.incrementScore()
            expect(store.getGroups[0].score).toBe(1)
        })

        it('continue to second player', () => {
            store.nextPlayer()
            expect(store.getCurrentPlayer?.name).toEqual('Steffé de Chefé')
        })

        it('switch to next round', () => {
            store.nextPlayer()
            store.nextPlayer()
            store.nextPlayer()
            expect(store.getCurrentPlayer?.name).toEqual('Liäm s \'')
            expect(store.getCurrentRound).toBe(1)
            expect(store.getGroupById(0)?.score).toBe(1)
        })

    })
})

