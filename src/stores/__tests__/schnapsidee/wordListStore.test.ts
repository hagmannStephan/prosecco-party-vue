import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWordListStore } from '@/stores/schnapsidee/wordListStore'
import { useGameStore } from '@/stores/schnapsidee/gameStore'

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
  if (url.includes('word-list.json')) {
    return Promise.resolve({
      json: () => Promise.resolve([
        { word: 'Hund', category: "standard", forbidden: ['Tier', 'bellen'] },
        { word: 'Katze', category: "standard", forbidden: ['Tier', 'miauen'] },
        { word: 'Vogel', category: "standard", forbidden: ['Tier', 'fliegen'] },
        { word: 'Auto', category: "standard", forbidden: ['fahren', 'Rad'] },
        { word: 'Haus', category: "other", forbidden: ['wohnen', 'Gebäude'] },
        { word: 'Baum', category: "other", forbidden: ['Wald', 'Pflanze'] },
        { word: 'Buch', category: "other", forbidden: ['lesen', 'Seite'] },
        { word: 'Stuhl', category: "else", forbidden: ['sitzen', 'Möbel'] },
        { word: 'Tisch', category: "else", forbidden: ['essen', 'Möbel'] },
        { word: 'Apfel', category: "else", forbidden: ['Obst', 'rot'] },
        { word: 'Brot', category: "else", forbidden: ['essen', 'Bäcker'] },
        { word: 'Fisch', category: "else", forbidden: ['Wasser', 'schwimmen'] },
        { word: 'Blume', category: "else", forbidden: ['Pflanze', 'duften'] },
        { word: 'Lampe', category: "else", forbidden: ['Licht', 'leuchten'] },
        { word: 'Fenster', category: "such", forbidden: ['Glas', 'sehen'] },
        { word: 'Fußball', category: "sport", forbidden: ['Ball', 'Tor'] },
        { word: 'Basketball', category: "sport", forbidden: ['Korb', 'werfen'] },
        { word: 'Tennis', category: "sport", forbidden: ['Schläger', 'Ball'] },
        { word: 'Schwimmen', category: "sport", forbidden: ['Wasser', 'Baden'] },
        { word: 'Laufen', category: "sport", forbidden: ['Rennen', 'Joggen'] },
        { word: 'Radfahren', category: "sport", forbidden: ['Fahrrad', 'Pedale'] },
        { word: 'Volleyball', category: "sport", forbidden: ['Netz', 'Ball'] },
        { word: 'Handball', category: "sport", forbidden: ['Tor', 'werfen'] },
        { word: 'Boxen', category: "sport", forbidden: ['Kampf', 'Handschuhe'] },
        { word: 'Golf', category: "sport", forbidden: ['Schläger', 'Loch'] },
        { word: 'Eishockey', category: "sport", forbidden: ['Puck', 'Schläger'] },
        { word: 'Skifahren', category: "sport", forbidden: ['Schnee', 'Berg'] },
        { word: 'Reiten', category: "sport", forbidden: ['Pferd', 'Sattel'] },
        { word: 'Turnen', category: "sport", forbidden: ['Gerät', 'Übung'] },
        { word: 'Tischtennis', category: "sport", forbidden: ['Schläger', 'Platte'] }
      ])
    })
  } else if (url.includes('word-list-en.json')) {
    return Promise.resolve({
      json: () => Promise.resolve([
        { word: 'dog', category: "standard", forbidden: ['animal', 'bark'] },
        { word: 'cat', category: "standard", forbidden: ['animal', 'meow'] },
        { word: 'bird', category: "standard", forbidden: ['animal', 'fly'] },
        { word: 'car', category: "standard", forbidden: ['drive', 'wheel'] },
        { word: 'house', category: "other", forbidden: ['live', 'building'] },
        { word: 'tree', category: "other", forbidden: ['forest', 'plant'] },
        { word: 'book', category: "other", forbidden: ['read', 'page'] },
        { word: 'chair', category: "else", forbidden: ['sit', 'furniture'] },
        { word: 'table', category: "else", forbidden: ['eat', 'furniture'] },
        { word: 'apple', category: "else", forbidden: ['fruit', 'red'] },
        { word: 'bread', category: "else", forbidden: ['eat', 'baker'] },
        { word: 'fish', category: "else", forbidden: ['water', 'swim'] },
        { word: 'flower', category: "else", forbidden: ['plant', 'smell'] },
        { word: 'lamp', category: "else", forbidden: ['light', 'shine'] },
        { word: 'window', category: "such", forbidden: ['glass', 'see'] },
        { word: 'soccer', category: "sport", forbidden: ['ball', 'goal'] },
        { word: 'basketball', category: "sport", forbidden: ['hoop', 'shoot'] },
        { word: 'tennis', category: "sport", forbidden: ['racket', 'ball'] },
        { word: 'swimming', category: "sport", forbidden: ['water', 'pool'] },
        { word: 'running', category: "sport", forbidden: ['race', 'jog'] },
        { word: 'cycling', category: "sport", forbidden: ['bike', 'pedal'] },
        { word: 'volleyball', category: "sport", forbidden: ['net', 'ball'] },
        { word: 'handball', category: "sport", forbidden: ['goal', 'throw'] },
        { word: 'boxing', category: "sport", forbidden: ['fight', 'gloves'] },
        { word: 'golf', category: "sport", forbidden: ['club', 'hole'] },
        { word: 'ice hockey', category: "sport", forbidden: ['puck', 'stick'] },
        { word: 'skiing', category: "sport", forbidden: ['snow', 'mountain'] },
        { word: 'horse riding', category: "sport", forbidden: ['horse', 'saddle'] },
        { word: 'gymnastics', category: "sport", forbidden: ['apparatus', 'exercise'] },
        { word: 'table tennis', category: "sport", forbidden: ['racket', 'table'] }
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
    expect(store.wordLists.de.length).toBe(30)
    expect(store.wordLists.en.length).toBe(30)
  })

  it('should return a random word', async () => {
    const store = useWordListStore()
    await store.init()

    const word = store.getRandomWord('en')
    expect(word).not.toBeNull()
  })

  it('should return the available categoriers', async () => {
    const store = useWordListStore()
    await store.init()

    const categories = store.getAvailableCategories('en')
    expect(categories.sort()).toEqual(['standard', 'other', 'sport', 'else', 'such'].sort())
  })

  it('adhere to word categories', async () => {
    const store = useWordListStore()
    await store.init()

    const gameStore = useGameStore()
    gameStore.setGameStore({
      groups: [
        {
          id: 1,
          name: 'Test Group',
          players: [{ name: 'Player 1' }, { name: 'Player 2' }],
          currentPlayerIndex: 0,
          score: 0,
        },
      ],
      rounds: 4,
      timePerRound: 60,
      gameModes: ['pantomime', 'describe'],
      allowedWordLists: ['standard', 'activity'],
    })

    for (let i = 0; i < 50; i++) {
      const word = store.getRandomWord('en')
      expect(word).not.toBeNull()
      expect(['standard', 'activity']).toContain(word?.category)
    }
  })

  it('same word doesn\'t appear twice in the last 10 words', async () => {
    const store = useWordListStore()
    await store.init()

    const gameStore = useGameStore()
    gameStore.setGameStore({
      groups: [
        {
          id: 1,
          name: 'Test Group',
          players: [{ name: 'Player 1' }, { name: 'Player 2' }],
          currentPlayerIndex: 0,
          score: 0,
        },
      ],
      rounds: 4,
      timePerRound: 60,
      gameModes: ['pantomime', 'describe'],
      allowedWordLists: ['sport'],
    })

    let lastTenWords: string[] = []

    for (let i = 0; i < 100; i++) {
      const currentWord = store.getRandomWord('en') || { word: '' }
      if (lastTenWords.includes(currentWord?.word)) {
        // If the word is already in the last 10 words, fail the test
        expect.fail(`Word ${currentWord?.word} appeared twice in the last 10 words`)
      }

      lastTenWords.push(currentWord?.word)

      if (lastTenWords.length > 10) {
        lastTenWords.shift() // Keep only the last 10 words
      }
    }
  })
})