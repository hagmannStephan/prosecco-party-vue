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
        rounds: 4,
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
            expect(store.getRounds).toBe(4)
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

        it('increment score for first group again', () => {
            for (let i = 0; i < 6; i++) {
                store.incrementScore()
            }
            expect(store.getGroups[0].score).toBe(7)
        })

        it('check if new players are up', () => {
            store.nextPlayer()
            expect(store.getCurrentPlayer?.name).toEqual('Joäü de §')
            store.nextPlayer()
            expect(store.getCurrentPlayer?.name).toEqual('Steffla Chef')
            store.nextPlayer()
            expect(store.getCurrentPlayer?.name).toEqual('Deff')
        })

        it('increment score for fourth group', () => {
            for (let i = 0; i < 21; i++) {
                store.incrementScore()
            }
            expect(store.getGroups[3].score).toBe(21)
        })

        it('check if new player is up', () => {
            store.nextPlayer()
            store.nextPlayer()
            expect(store.getCurrentPlayer?.name).toEqual('Chef de Steff')
        })

        it('increment score for second group', () => {
            for (let i = 0; i < 3; i++) {
                store.incrementScore()
            }
            expect(store.getGroups[1].score).toBe(3)
        })

        it('increment score for third group', () => {
            store.nextPlayer()
            for (let i = 0; i < 8; i++) {
                store.incrementScore()
            }
            expect(store.getGroups[2].score).toBe(8)
        })

        it('finish game', () => {
            let gameOver = false
            // Need 12 nextPlayer per round
            console.log('Rounds on start: ', store.getCurrentRound)
            for (let i = 0; i < (2 + (4 * 12)); i++) {
                gameOver = store.nextPlayer()
            }
            expect(gameOver).toBe(false);
        })
    })
})

