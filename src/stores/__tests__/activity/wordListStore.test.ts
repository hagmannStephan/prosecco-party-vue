import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWordListStore } from '@/stores/activity/wordListStore'
import { useGameStore } from '@/stores/activity/gameStore'

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
        { word: 'Hund', difficulty: 'easy', category: "standard", forbidden: ['Tier', 'bellen'] },
        { word: 'Katze', difficulty: 'easy', category: "standard", forbidden: ['Tier', 'miauen'] },
        { word: 'Vogel', difficulty: 'easy', category: "standard", forbidden: ['Tier', 'fliegen'] },
        { word: 'Auto', difficulty: 'easy', category: "standard", forbidden: ['fahren', 'Rad'] },
        { word: 'Haus', difficulty: 'easy', category: "other", forbidden: ['wohnen', 'Gebäude'] },
        { word: 'Baum', difficulty: 'easy', category: "other", forbidden: ['Wald', 'Pflanze'] },
        { word: 'Buch', difficulty: 'easy', category: "other", forbidden: ['lesen', 'Seite'] },
        { word: 'Stuhl', difficulty: 'easy', category: "else", forbidden: ['sitzen', 'Möbel'] },
        { word: 'Tisch', difficulty: 'easy', category: "else", forbidden: ['essen', 'Möbel'] },
        { word: 'Apfel', difficulty: 'easy', category: "else", forbidden: ['Obst', 'rot'] },
        { word: 'Brot', difficulty: 'easy', category: "else", forbidden: ['essen', 'Bäcker'] },
        { word: 'Fisch', difficulty: 'easy', category: "else", forbidden: ['Wasser', 'schwimmen'] },
        { word: 'Blume', difficulty: 'easy', category: "else", forbidden: ['Pflanze', 'duften'] },
        { word: 'Lampe', difficulty: 'easy', category: "else", forbidden: ['Licht', 'leuchten'] },
        { word: 'Fenster', difficulty: 'easy', category: "such", forbidden: ['Glas', 'sehen'] },
        { word: 'Fußball', difficulty: 'easy', category: "sport", forbidden: ['Ball', 'Tor'] },
        { word: 'Basketball', difficulty: 'easy', category: "sport", forbidden: ['Korb', 'werfen'] },
        { word: 'Tennis', difficulty: 'easy', category: "sport", forbidden: ['Schläger', 'Ball'] },
        { word: 'Schwimmen', difficulty: 'easy', category: "sport", forbidden: ['Wasser', 'Baden'] },
        { word: 'Laufen', difficulty: 'easy', category: "sport", forbidden: ['Rennen', 'Joggen'] },
        { word: 'Radfahren', difficulty: 'easy', category: "sport", forbidden: ['Fahrrad', 'Pedale'] },
        { word: 'Volleyball', difficulty: 'easy', category: "sport", forbidden: ['Netz', 'Ball'] },
        { word: 'Handball', difficulty: 'easy', category: "sport", forbidden: ['Tor', 'werfen'] },
        { word: 'Boxen', difficulty: 'easy', category: "sport", forbidden: ['Kampf', 'Handschuhe'] },
        { word: 'Golf', difficulty: 'easy', category: "sport", forbidden: ['Schläger', 'Loch'] },
        { word: 'Eishockey', difficulty: 'easy', category: "sport", forbidden: ['Puck', 'Schläger'] },
        { word: 'Skifahren', difficulty: 'easy', category: "sport", forbidden: ['Schnee', 'Berg'] },
        { word: 'Reiten', difficulty: 'easy', category: "sport", forbidden: ['Pferd', 'Sattel'] },
        { word: 'Turnen', difficulty: 'easy', category: "sport", forbidden: ['Gerät', 'Übung'] },
        { word: 'Tischtennis', difficulty: 'easy', category: "sport", forbidden: ['Schläger', 'Platte'] }
      ])
    })
  } else if (url.includes('word-list-en.json')) {
    return Promise.resolve({
      json: () => Promise.resolve([
        { word: 'dog', difficulty: 'easy', category: "standard", forbidden: ['animal', 'bark'] },
        { word: 'cat', difficulty: 'easy', category: "standard", forbidden: ['animal', 'meow'] },
        { word: 'bird', difficulty: 'easy', category: "standard", forbidden: ['animal', 'fly'] },
        { word: 'car', difficulty: 'easy', category: "standard", forbidden: ['drive', 'wheel'] },
        { word: 'house', difficulty: 'easy', category: "other", forbidden: ['live', 'building'] },
        { word: 'tree', difficulty: 'easy', category: "other", forbidden: ['forest', 'plant'] },
        { word: 'book', difficulty: 'easy', category: "other", forbidden: ['read', 'page'] },
        { word: 'chair', difficulty: 'easy', category: "else", forbidden: ['sit', 'furniture'] },
        { word: 'table', difficulty: 'easy', category: "else", forbidden: ['eat', 'furniture'] },
        { word: 'apple', difficulty: 'easy', category: "else", forbidden: ['fruit', 'red'] },
        { word: 'bread', difficulty: 'easy', category: "else", forbidden: ['eat', 'baker'] },
        { word: 'fish', difficulty: 'easy', category: "else", forbidden: ['water', 'swim'] },
        { word: 'flower', difficulty: 'easy', category: "else", forbidden: ['plant', 'smell'] },
        { word: 'lamp', difficulty: 'easy', category: "else", forbidden: ['light', 'shine'] },
        { word: 'window', difficulty: 'easy', category: "such", forbidden: ['glass', 'see'] },
        { word: 'soccer', difficulty: 'easy', category: "sport", forbidden: ['ball', 'goal'] },
        { word: 'basketball', difficulty: 'easy', category: "sport", forbidden: ['hoop', 'shoot'] },
        { word: 'tennis', difficulty: 'easy', category: "sport", forbidden: ['racket', 'ball'] },
        { word: 'swimming', difficulty: 'easy', category: "sport", forbidden: ['water', 'pool'] },
        { word: 'running', difficulty: 'easy', category: "sport", forbidden: ['race', 'jog'] },
        { word: 'cycling', difficulty: 'easy', category: "sport", forbidden: ['bike', 'pedal'] },
        { word: 'volleyball', difficulty: 'easy', category: "sport", forbidden: ['net', 'ball'] },
        { word: 'handball', difficulty: 'easy', category: "sport", forbidden: ['goal', 'throw'] },
        { word: 'boxing', difficulty: 'easy', category: "sport", forbidden: ['fight', 'gloves'] },
        { word: 'golf', difficulty: 'easy', category: "sport", forbidden: ['club', 'hole'] },
        { word: 'ice hockey', difficulty: 'easy', category: "sport", forbidden: ['puck', 'stick'] },
        { word: 'skiing', difficulty: 'easy', category: "sport", forbidden: ['snow', 'mountain'] },
        { word: 'horse riding', difficulty: 'easy', category: "sport", forbidden: ['horse', 'saddle'] },
        { word: 'gymnastics', difficulty: 'easy', category: "sport", forbidden: ['apparatus', 'exercise'] },
        { word: 'table tennis', difficulty: 'easy', category: "sport", forbidden: ['racket', 'table'] }
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

  it('should return the available categoriers', async () => {
    const store = useWordListStore()
    await store.init()

    const categories = store.getAvailableCategories('en')
    expect(categories.sort()).toEqual(['standard', 'other', 'sport', 'else', 'such'].sort())
  })
  
  // it('adhere to word categories', async () => {
  //   const store = useWordListStore()
  //   await store.init()

  //   const gameStore = useGameStore()
  //   gameStore.setGameSettings({
  //     groups: [
  //       {
  //         id: 1,
  //         name: 'Test Group',
  //         players: [{ name: 'Player 1' }, { name: 'Player 2' }],
  //         currentPlayerIndex: 0,
  //         score: 0,
  //       },
  //     ],
  //     rounds: 4,
  //     timePerRound: 60,
  //     gameModes: ['pantomime', 'describe'],
  //     wordCategories: ['standard', 'activity'],
  //   })
  //   gameStore.initGameStore()

  //   for (let i = 0; i < 50; i++) {
  //     const word = store.getRandomWord('en')
  //     expect(word).not.toBeNull()
  //     expect(['standard', 'activity']).toContain(word?.category)
  //   }
  // })

  // it('same word doesn\'t appear twice in the last 10 words', async () => {	
  //   const store = useWordListStore()
  //   await store.init()

  //   const gameStore = useGameStore()
  //   gameStore.setGameSettings({
  //     groups: [
  //       {
  //         id: 1,
  //         name: 'Test Group',
  //         players: [{ name: 'Player 1' }, { name: 'Player 2' }],
  //         currentPlayerIndex: 0,
  //         score: 0,
  //       },
  //     ],
  //     rounds: 4,
  //     timePerRound: 60,
  //     gameModes: ['pantomime', 'describe'],
  //     wordCategories: ['sport'],
  //   })
  //   gameStore.initGameStore()

  //   let lastTenWords: string[] = []

  //   for (let i = 0; i < 100; i++) {
  //     const currentWord = store.getRandomWord('en') || {word: ''}
  //     if(lastTenWords.includes(currentWord?.word)) {
  //       // If the word is already in the last 10 words, fail the test
  //       expect.fail(`Word ${currentWord?.word} appeared twice in the last 10 words`)
  //     }

  //     lastTenWords.push(currentWord?.word)

  //     if (lastTenWords.length > 10) {
  //       lastTenWords.shift() // Keep only the last 10 words
  //     }
  //   }
  // })
})