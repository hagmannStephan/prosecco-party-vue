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
                    { name: "Röff"}
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

    // describe(('simulate game'), () => {
    //     let store: ReturnType<typeof useGameStore>

    //     setActivePinia(createPinia())
    //     store = createTestStore()

    //     it('first player turn', () => {
    //         expect(store.getCurrentPlayer?.name).toEqual('Liäm s \'')
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //     })

    //     it('increment score', () => {
    //         store.incrementScore()
    //         expect(store.getGroups[0].score).toBe(1)
    //     })

    //     it('continue to second player', () => {
    //         store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         expect(store.getCurrentPlayer?.name).toEqual('Steffé de Chefé')
    //     })

    //     it('switch to next round', () => {
    //         store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         expect(store.getCurrentPlayer?.name).toEqual('Liäm s \'')
    //         expect(store.getCurrentRound).toBe(0)
    //         expect(store.getGroupById(0)?.score).toBe(1)
    //     })

    //     it('increment score for first group again', () => {
    //         for (let i = 0; i < 6; i++) {
    //             store.incrementScore()
    //         }
    //         expect(store.getGroups[0].score).toBe(7)
    //     })

    //     it('check if new players are up', () => {
    //         store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         expect(store.getCurrentPlayer?.name).toEqual('Joäü de §')
    //         store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         expect(store.getCurrentPlayer?.name).toEqual('Steffla Chef')
    //         store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         expect(store.getCurrentPlayer?.name).toEqual('Deff')
    //     })

    //     it('increment score for fourth group', () => {
    //         for (let i = 0; i < 21; i++) {
    //             store.incrementScore()
    //         }
    //         expect(store.getGroups[3].score).toBe(21)
    //     })

    //     it('check if new player is up', () => {
    //         store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         expect(store.getCurrentPlayer?.name).toEqual('Chef de Steff')
    //         expect(store.getCurrentGroup?.name).toEqual('ÖpisÉ')
    //     })

    //     it('increment score for second group', () => {
    //         for (let i = 0; i < 3; i++) {
    //             store.incrementScore()
    //         }
    //         expect(store.getGroups[1].score).toBe(3)
    //     })

    //     it('increment score for third group', () => {
    //         store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         for (let i = 0; i < 8; i++) {
    //             store.incrementScore()
    //         }
    //         expect(store.getGroups[2].score).toBe(8)
    //     })

    //     it('finish game', () => {
    //         let gameOver = false

    //         for (let i = 0; i < (1 + (3 * 12)); i++) {
    //             gameOver = store.nextPlayer()
    //             expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         }
    //         expect(gameOver).toBe(false);

    //         gameOver = store.nextPlayer()
    //         expect(store.getCurrentGameMode?.name).not.toEqual('draw')
    //         expect(gameOver).toBe(true);
    //     })

    //     it('get leaderboard', () => {
    //         const leaderboard = store.getLeaderboard();
    //         expect(leaderboard).toEqual([
    //             { name: 'NPCs', score: 21 },
    //             { name: 'SonderzeicheGang *"+&%ç()=?`', score: 8 },
    //             { name: 'De Ä$$', score: 7 },
    //             { name: 'ÖpisÉ', score: 3 },
    //         ]);
    //     });
    // })
})

// TODO: Remove comment from wordListStore.test.ts