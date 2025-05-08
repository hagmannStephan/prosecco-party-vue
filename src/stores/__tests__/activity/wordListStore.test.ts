import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWordListStore } from '@/stores/activity/wordListStore'

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
  if (url.includes('word-list-de.json')) {
    return Promise.resolve({
      json: () => Promise.resolve([
        { word: 'Hund', difficulty: 'easy', forbidden: ['Tier', 'bellen'] },
        { word: 'Katze', difficulty: 'easy', forbidden: ['Tier', 'miauen'] }
      ])
    })
  } else if (url.includes('word-list-en.json')) {
    return Promise.resolve({
      json: () => Promise.resolve([
        { word: 'dog', difficulty: 'easy', forbidden: ['animal', 'bark'] },
        { word: 'cat', difficulty: 'easy', forbidden: ['animal', 'meow'] }
      ])
    })
  }
  return Promise.reject(new Error(`Unhandled URL: ${url}`))
})

describe('Word List Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize the store', async () => {
    const store = useWordListStore()
    await store.init()
    
    expect(store.isInitialized).toBe(true)
    expect(store.wordLists.de.length).toBe(2)
    expect(store.wordLists.en.length).toBe(2)
  })

  it('should return a random word with specified difficulty', async () => {
    const store = useWordListStore()
    await store.init()
    
    const word = store.getRandomWord('en', ['easy'])
    expect(word).not.toBeNull()
    expect(word?.difficulty).toBe('easy')
  })

  it('should return null when no words match the difficulty criteria', async () => {
    const store = useWordListStore()
    await store.init()
    
    const word = store.getRandomWord('en', ['impossible'])
    expect(word).toBeNull()
  })
})