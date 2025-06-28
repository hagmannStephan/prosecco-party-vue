import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePenaltiesStore } from '@/stores/penaltiesStore'

// Mock the indexed db module
vi.mock('idb', () => ({
    openDB: vi.fn().mockImplementation(() => ({
        transaction: () => ({
        objectStore: () => ({
            get: vi.fn().mockImplementation(() => {
            // Simulate empty DB
            return Promise.resolve(null)
            }),
            put: vi.fn().mockResolvedValue(undefined)
        }),
        done: Promise.resolve()
        })
    }))
}))

// Mock fetch for local file loading
global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes('de/penalty-list.json')) {
        return Promise.resolve({
            json: () => Promise.resolve([
                'Penalty 1',
                'Penalty 2',
                'Penalty 3',
                'Penalty 4',
                'Penalty 5'
            ])
        })
    } else if (url.includes('en/penalty-list.json')) {
        return Promise.resolve({
            json: () => Promise.resolve([
                'Penalty 1 EN',
                'Penalty 2 EN',
                'Penalty 3 EN',
                'Penalty 4 EN',
                'Penalty 5 EN'
            ])
        })
    }
    return Promise.reject(new Error('Unknown URL'))
})

describe('Penalties Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('should initialize the store', async () => {
        const store = usePenaltiesStore()
        await store.init()

        expect(store.isInitialized).toBe(true)
        expect(store.penalties.de.length).toBe(5)
        expect(store.penalties.en.length).toBe(5)
    })

    it('should return a random penalty selection', async () => {
        const store = usePenaltiesStore()
        await store.init()

        const penalties = store.getRandomPenaltySelection('en')
        expect(penalties.length).toBe(3)
        expect(store.penalties.en.includes(penalties[0])).toBe(true)
    })

    it('should return unique penalties', async () => {
        const store = usePenaltiesStore()
        await store.init()

        for (let i = 0; i < 100; i++) {
            const penalties = store.getRandomPenaltySelection('en')
            
            const uniquePenalties = new Set(penalties)
            expect(uniquePenalties.size).toBe(penalties.length)
        }
    })
})